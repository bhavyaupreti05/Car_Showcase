import { create } from 'zustand';
import { carAPI } from './api';
import toast from 'react-hot-toast';

export const useCarStore = create((set, get) => ({
  // State
  cars: [],
  loading: false,
  error: null,
  selectedCars: [],
  compareOpen: false,
  dragRaceOpen: false,
  budget: '',
  garage: [],
  recommendations: [],
  recommendationSummary: '',
  recommendationPersona: null,
  recommendationLoading: false,
  selectedPersona: 'track_enthusiast',
  dnaResult: null,
  dnaLoading: false,
  comparisonData: null,
  comparisonLoading: false,

  // Actions
  setSelectedPersona: (id) => set({ selectedPersona: id }),
  openCompareModal: () => set({ compareOpen: true }),
  closeCompareModal: () => set({ compareOpen: false }),
  openDragRace: () => set({ dragRaceOpen: true }),
  closeDragRace: () => set({ dragRaceOpen: false }),
  setBudget: (value) => set({ budget: value }),
  addToGarage: (car) =>
    set((state) =>
      state.garage.some((item) => item._id === car._id)
        ? state
        : { garage: [...state.garage, car] }
    ),
  removeFromGarage: (carId) =>
    set((state) => ({ garage: state.garage.filter((car) => car._id !== carId) })),
  clearGarage: () => set({ garage: [] }),

  fetchCars: async (filters = {}) => {
    set({ loading: true, error: null });
    try {
      const response = await carAPI.getAllCars(filters);
      set({ cars: response.data.data, loading: false });
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      set({ error: message, loading: false });
      toast.error(message);
    }
  },

  getRecommendations: async (query, persona) => {
    set({ recommendationLoading: true, error: null });
    try {
      const activePersona = persona || get().selectedPersona;
      const response = await carAPI.getRecommendations(query, activePersona);
      set({
        recommendations: response.data.data.recommendations,
        recommendationSummary: response.data.data.summary,
        recommendationPersona: response.data.data.persona,
        recommendationLoading: false,
      });
      toast.success('Recommendations generated!');
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      set({ error: message, recommendationLoading: false });
      toast.error(message);
    }
  },

  fetchDnaMatch: async (answers, persona) => {
    set({ dnaLoading: true, error: null });
    try {
      const activePersona = persona || get().selectedPersona;
      const response = await carAPI.getDnaMatch(answers, activePersona);
      set({ dnaResult: response.data.data, dnaLoading: false });
      toast.success('Automotive DNA Match Found!');
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      set({ error: message, dnaLoading: false });
      toast.error(message);
    }
  },

  clearDnaResult: () => set({ dnaResult: null }),

  compareCars: async (car1Id, car2Id) => {
    set({ comparisonLoading: true, error: null });
    try {
      const response = await carAPI.compareCars(car1Id, car2Id);
      set({ comparisonData: response.data.data, comparisonLoading: false });
      toast.success('Comparison generated!');
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      set({ error: message, comparisonLoading: false });
      toast.error(message);
    }
  },

  clearSelectedCars: () => set({ selectedCars: [] }),

  toggleCarSelection: (carId) => {
    set((state) => {
      const isSelected = state.selectedCars.some((id) => id === carId);
      const newSelection = isSelected
        ? state.selectedCars.filter((id) => id !== carId)
        : state.selectedCars.length < 2
        ? [...state.selectedCars, carId]
        : state.selectedCars;

      return {
        selectedCars: newSelection,
      };
    });
  },

  clearComparison: () => set({ comparisonData: null, compareOpen: false, selectedCars: [] }),
  clearRecommendations: () => set({ recommendations: [] }),
}));
