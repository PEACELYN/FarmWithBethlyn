import React, { createContext, useContext, useState, useEffect } from 'react';

export interface DailyRecord {
  id: string;
  date: string;
  eggsCollected: number;
  eggsBroken: number;
  eggsSpoilt: number;
  eggsSold: number;
  eggPrice: number;
  fowlDeaths: number;
  newHatches: number;
  feedConsumed: number;
  feedCost: number;
  medicationGiven: boolean;
  medicationDetails: string;
  dailyCheckNotes: string;
  disinfectionDone: boolean;
}

export interface Schedule {
  id: string;
  type: 'feeding' | 'medication' | 'disinfection' | 'inspection';
  title: string;
  time: string;
  frequency: string;
  description: string;
  active: boolean;
}

interface FarmData {
  totalFowls: number;
  totalEggs: number;
  totalProfit: number;
  dailyRecords: DailyRecord[];
  schedules: Schedule[];
}

interface FarmContextType {
  farmData: FarmData;
  addDailyRecord: (record: Omit<DailyRecord, 'id'>) => void;
  addSchedule: (schedule: Omit<Schedule, 'id'>) => void;
  updateSchedule: (id: string, updates: Partial<Schedule>) => void;
  deleteSchedule: (id: string) => void;
  getMetrics: () => {
    totalRevenue: number;
    totalCosts: number;
    netProfit: number;
    eggProductionRate: number;
    mortalityRate: number;
    feedEfficiency: number;
  };
}

const FarmContext = createContext<FarmContextType | undefined>(undefined);

const initialSchedules: Schedule[] = [
  {
    id: '1',
    type: 'feeding',
    title: 'Morning Feed',
    time: '06:00',
    frequency: 'Daily',
    description: 'Layer feed with supplements',
    active: true
  },
  {
    id: '2',
    type: 'feeding',
    title: 'Evening Feed',
    time: '17:00',
    frequency: 'Daily',
    description: 'Regular layer feed',
    active: true
  },
  {
    id: '3',
    type: 'medication',
    title: 'Weekly Vitamin Boost',
    time: '09:00',
    frequency: 'Weekly',
    description: 'Vitamin supplements in water',
    active: true
  },
  {
    id: '4',
    type: 'disinfection',
    title: 'Coop Disinfection',
    time: '14:00',
    frequency: 'Weekly',
    description: 'Deep clean and disinfect coops',
    active: true
  }
];

export function FarmProvider({ children }: { children: React.ReactNode }) {
  const [farmData, setFarmData] = useState<FarmData>({
    totalFowls: 1250,
    totalEggs: 0,
    totalProfit: 0,
    dailyRecords: [],
    schedules: initialSchedules
  });

  // Load data from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem('farmData');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setFarmData({
          ...parsedData,
          schedules: parsedData.schedules || initialSchedules
        });
      } catch (error) {
        console.error('Error loading saved data:', error);
        setFarmData({
          totalFowls: 1250,
          totalEggs: 0,
          totalProfit: 0,
          dailyRecords: [],
          schedules: initialSchedules
        });
      }
    }
  }, []);

  // Save data to localStorage whenever farmData changes
  useEffect(() => {
    localStorage.setItem('farmData', JSON.stringify(farmData));
  }, [farmData]);

  const addDailyRecord = (record: Omit<DailyRecord, 'id'>) => {
    const newRecord: DailyRecord = {
      ...record,
      id: Date.now().toString()
    };

    setFarmData(prev => ({
      ...prev,
      dailyRecords: [...prev.dailyRecords, newRecord],
      totalFowls: prev.totalFowls + record.newHatches - record.fowlDeaths,
      totalEggs: prev.totalEggs + record.eggsCollected,
      totalProfit: prev.totalProfit + (record.eggsSold * record.eggPrice) - record.feedCost
    }));
  };

  const addSchedule = (schedule: Omit<Schedule, 'id'>) => {
    const newSchedule: Schedule = {
      ...schedule,
      id: Date.now().toString()
    };

    setFarmData(prev => ({
      ...prev,
      schedules: [...prev.schedules, newSchedule]
    }));
  };

  const updateSchedule = (id: string, updates: Partial<Schedule>) => {
    setFarmData(prev => ({
      ...prev,
      schedules: prev.schedules.map(schedule =>
        schedule.id === id ? { ...schedule, ...updates } : schedule
      )
    }));
  };

  const deleteSchedule = (id: string) => {
    setFarmData(prev => ({
      ...prev,
      schedules: prev.schedules.filter(schedule => schedule.id !== id)
    }));
  };

  const getMetrics = () => {
    const records = farmData.dailyRecords;
    const totalRevenue = records.reduce((sum, record) => sum + (record.eggsSold * record.eggPrice), 0);
    const totalCosts = records.reduce((sum, record) => sum + record.feedCost, 0);
    const netProfit = totalRevenue - totalCosts;
    const totalEggs = records.reduce((sum, record) => sum + record.eggsCollected, 0);
    const totalDeaths = records.reduce((sum, record) => sum + record.fowlDeaths, 0);
    const totalFeed = records.reduce((sum, record) => sum + record.feedConsumed, 0);

    return {
      totalRevenue,
      totalCosts,
      netProfit,
      eggProductionRate: farmData.totalFowls > 0 ? (totalEggs / (farmData.totalFowls * records.length)) * 100 : 0,
      mortalityRate: farmData.totalFowls > 0 ? (totalDeaths / farmData.totalFowls) * 100 : 0,
      feedEfficiency: totalFeed > 0 ? totalEggs / totalFeed : 0
    };
  };

  return (
    <FarmContext.Provider value={{
      farmData,
      addDailyRecord,
      addSchedule,
      updateSchedule,
      deleteSchedule,
      getMetrics
    }}>
      {children}
    </FarmContext.Provider>
  );
}

export function useFarm() {
  const context = useContext(FarmContext);
  if (context === undefined) {
    throw new Error('useFarm must be used within a FarmProvider');
  }
  return context;
}