import { getGrillzLabourCost, getGrillzTotal, getToothValue } from '../../utils/get-totals';
import {
  MOCK_LABOUR_COST,
  MOCK_OPTION_PRICE,
  MOCK_VARIANT_PRICE,
  mockGrillzForm,
} from '../../utils/test-utils/mock-data';

const mockFormData = mockGrillzForm();

describe('Grillz Total Calculations', () => {
  describe('getGrillzLabourCost', () => {
    it('should return the labour cost from the material', () => {
      expect(getGrillzLabourCost(mockFormData)).toBe(MOCK_LABOUR_COST);
    });

    it('should return 0 if no material is provided', () => {
      const formWithoutMaterial = { ...mockFormData, material: null };
      expect(getGrillzLabourCost(formWithoutMaterial)).toBe(0);
    });
  });

  describe('getToothValue', () => {
    it('should return the sum of variant and option prices', () => {
      expect(getToothValue(mockFormData)).toBe(MOCK_VARIANT_PRICE + MOCK_OPTION_PRICE);
    });

    it('should return 0 if no variant or option is provided', () => {
      const formWithoutVariantAndOption = {
        ...mockFormData,
        variant: null,
        option: null,
      };
      expect(getToothValue(formWithoutVariantAndOption)).toBe(0);
    });

    it('should return only variant price if no option is provided', () => {
      const formWithoutOption = { ...mockFormData, option: null };
      expect(getToothValue(formWithoutOption)).toBe(MOCK_VARIANT_PRICE);
    });

    it('should return only option price if no variant is provided', () => {
      const formWithoutVariant = { ...mockFormData, variant: null };
      expect(getToothValue(formWithoutVariant)).toBe(MOCK_OPTION_PRICE);
    });
  });

  describe('getGrillzTotal', () => {
    it('should calculate the total correctly', () => {
      const expectedTotal =
        (MOCK_VARIANT_PRICE + MOCK_OPTION_PRICE) * mockFormData.selectedTeeth.length +
        MOCK_LABOUR_COST;
      expect(getGrillzTotal(mockFormData)).toBe(expectedTotal);
    });

    it('should return 0 if material is not provided', () => {
      const formWithoutMaterial = { ...mockFormData, material: null };
      expect(getGrillzTotal(formWithoutMaterial)).toBe(0);
    });

    it('should return 0 if selectedTeeth is not provided', () => {
      const formWithoutSelectedTeeth = { ...mockFormData, selectedTeeth: [] };
      expect(getGrillzTotal(formWithoutSelectedTeeth)).toBe(0);
    });
  });
});
