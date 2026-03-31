import { 
  calculateMetrics as calculateMetricsService 
} from '../services/metric.service.js';
import { getRange } from '../utils/range.js';

export const calculateMetrics = async (req, res) => {
  try {
    const query = {
      userId: req.user._id,
      timeRange: 'ALL',
    };
    if (req.query.timeRange) {
      query.timeRange = getRange(req.query.timeRange);
    }
    if (req.query.accountId && req.query.accountId !== 'all') {
      query.accountId = req.query.accountId;
    }
    
    const response = await calculateMetricsService(query);
    res.status(200).json({success: true, data: response});
  } catch (error) {
    res.status(500).json({success: false, error: error.message});
  }
}
