import { describe, it, expect } from 'vitest';
import {
  clampPercentage,
  calculateIGE,
  calculateCLO,
  calculateAutonomy,
  calculateRecentralization,
  calculateProcessMaturity,
  calculateRoadmapProgress,
  calculateProvisionalIDE,
  getMaturityLevel
} from '../calculations.js';

describe('Governance Calculations', () => {
  describe('clampPercentage', () => {
    it('should limit between 0 and 100', () => {
      expect(clampPercentage(150)).toBe(100);
      expect(clampPercentage(-50)).toBe(0);
      expect(clampPercentage(45.567)).toBe(45.57);
    });

    it('should handle invalid values', () => {
      expect(clampPercentage(null)).toBe(0);
      expect(clampPercentage(undefined)).toBe(0);
      expect(clampPercentage(NaN)).toBe(0);
    });
  });

  describe('calculateIGE', () => {
    it('should calculate IGE correctly', () => {
      const ige = calculateIGE({
        ide: 20, // indEmpresario = 80
        clo: 60,
        autonomy: 70,
        processMaturity: 50,
        automation: 40,
        governance: 80
      });
      // 0.25*80 + 0.15*60 + 0.20*70 + 0.15*50 + 0.10*40 + 0.15*80
      // 20 + 9 + 14 + 7.5 + 4 + 12 = 66.5
      expect(ige).toBe(66.5);
    });
  });

  describe('calculateCLO', () => {
    it('should calculate CLO correctly', () => {
      expect(calculateCLO(10, 50)).toBe(80); // 100 - (10/50*100) = 80
    });

    it('should return 0 when operational hours > total hours', () => {
      expect(calculateCLO(60, 50)).toBe(0);
    });

    it('should handle negative hours', () => {
      expect(calculateCLO(-10, 50)).toBe(100);
    });

    it('should handle division by zero', () => {
      expect(calculateCLO(10, 0)).toBe(0);
    });
  });

  describe('calculateAutonomy', () => {
    it('should calculate autonomy correctly', () => {
      expect(calculateAutonomy(40, 10)).toBe(80); // 40 / 50 * 100
    });

    it('should handle division by zero', () => {
      expect(calculateAutonomy(0, 0)).toBe(0);
    });
  });

  describe('calculateRecentralization', () => {
    it('should calculate recentralization correctly', () => {
      expect(calculateRecentralization(2, 10)).toBe(20);
    });

    it('should handle zero delegated', () => {
      expect(calculateRecentralization(2, 0)).toBe(0);
    });
  });

  describe('calculateProcessMaturity', () => {
    it('should calculate correctly (50% doc / 50% adh)', () => {
      // 10 prio, 5 doc (50% doc) -> 25% final weight
      // 80% adh -> 40% final weight
      // Result = 65
      expect(calculateProcessMaturity(10, 5, 80)).toBe(65);
    });

    it('should not allow documented to exceed priority processes', () => {
      expect(calculateProcessMaturity(10, 15, 100)).toBe(100);
    });
  });

  describe('calculateRoadmapProgress', () => {
    it('should only count validated tasks', () => {
      const tasks = [
        { status: 'validated', weight: 2 },
        { status: 'in_execution', weight: 2 },
        { status: 'validated', weight: 1 }, // total weight = 5, validated = 3
      ];
      expect(calculateRoadmapProgress(tasks)).toBe(60); // 3 / 5 = 60%
    });

    it('should treat missing weight as 1', () => {
      const tasks = [
        { status: 'validated' },
        { status: 'not_started', weight: 0 },
        { status: 'not_started', weight: null }
      ];
      // total weights = 1 + 1 + 1 = 3. validated = 1.
      expect(calculateRoadmapProgress(tasks)).toBe(33.33);
    });

    it('should return 0 for empty array', () => {
      expect(calculateRoadmapProgress([])).toBe(0);
      expect(calculateRoadmapProgress(null)).toBe(0);
    });
  });

  describe('calculateProvisionalIDE', () => {
    it('should calculate IDE correctly', () => {
      const ide = calculateProvisionalIDE({
        decisionsToOwner: 30, decisionsByLeaders: 70, // depDecisions = 30%
        operationalHours: 20, totalHours: 40, // depTime = 50%
        independentProcesses: 4, priorityProcesses: 10, // depProcesses = 60%
        recentralized: 1, delegated: 10 // recRate = 10%
      });
      // 0.35*30 + 0.30*50 + 0.20*60 + 0.15*10
      // 10.5 + 15 + 12 + 1.5 = 39
      expect(ide).toBe(39);
    });
  });

  describe('getMaturityLevel', () => {
    it('should classify correctly', () => {
      expect(getMaturityLevel(10)).toBe("Operação");
      expect(getMaturityLevel(24.99)).toBe("Operação");
      expect(getMaturityLevel(25)).toBe("Gestão");
      expect(getMaturityLevel(49)).toBe("Gestão");
      expect(getMaturityLevel(50)).toBe("Liderança");
      expect(getMaturityLevel(74)).toBe("Liderança");
      expect(getMaturityLevel(75)).toBe("Governo");
      expect(getMaturityLevel(100)).toBe("Governo");
    });
  });
});
