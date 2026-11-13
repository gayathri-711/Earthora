import Crop from '../models/Crop.js';
import Farmer from '../models/Farmer.js';
import { ApiError, asyncHandler, sendSuccess } from '../utils/http.js';

export const getCrops = asyncHandler(async (req, res) => {
  const { farmerId, status } = req.query;
  const filter = {};
  if (farmerId) filter.farmer = farmerId;
  if (status) filter.status = status;

  // If farmer user is logged in and requesting their own crops
  if (req.user && req.user.role === 'farmer' && !farmerId) {
    const farmer = await Farmer.findOne({ user: req.user._id });
    if (farmer) filter.farmer = farmer._id;
  }

  const crops = await Crop.find(filter).sort({ createdAt: -1 });
  sendSuccess(res, { crops });
});

export const getCropById = asyncHandler(async (req, res) => {
  const crop = await Crop.findById(req.params.id).populate('farmer', 'name farmName location');
  if (!crop) throw new ApiError(404, 'Crop record not found');
  sendSuccess(res, { crop });
});

export const createCrop = asyncHandler(async (req, res) => {
  const {
    name,
    variety,
    fieldName,
    acreage,
    plantingDate,
    estimatedHarvestDate,
    status = 'Seedling',
    growthProgress = 15,
    expectedYieldKg,
    soilHealthScore = 85,
    notes,
  } = req.body;

  if (!name || !fieldName || !estimatedHarvestDate) {
    throw new ApiError(400, 'Crop name, field name, and estimated harvest date are required');
  }

  let farmerId = req.body.farmerId;
  let farmName = req.body.farmName || 'Earthora Partner Farm';

  if (req.user && req.user.role === 'farmer') {
    const farmer = await Farmer.findOne({ user: req.user._id });
    if (farmer) {
      farmerId = farmer._id;
      farmName = farmer.farmName;
    }
  }

  if (!farmerId) {
    const firstFarmer = await Farmer.findOne();
    if (firstFarmer) {
      farmerId = firstFarmer._id;
      farmName = firstFarmer.farmName;
    }
  }

  const crop = await Crop.create({
    farmer: farmerId,
    farmName,
    name,
    variety: variety || 'Heirloom Organic',
    fieldName,
    acreage: Number(acreage || 5),
    plantingDate: plantingDate ? new Date(plantingDate) : new Date(),
    estimatedHarvestDate: new Date(estimatedHarvestDate),
    status,
    growthProgress: Number(growthProgress || 20),
    expectedYieldKg: Number(expectedYieldKg || 2500),
    soilHealthScore: Number(soilHealthScore || 88),
    notes: notes || '',
  });

  sendSuccess(res, { crop }, 'Crop record created successfully', 201);
});

export const updateCrop = asyncHandler(async (req, res) => {
  const crop = await Crop.findById(req.params.id);
  if (!crop) throw new ApiError(404, 'Crop record not found');

  const fields = [
    'name',
    'variety',
    'fieldName',
    'acreage',
    'plantingDate',
    'estimatedHarvestDate',
    'actualHarvestDate',
    'status',
    'growthProgress',
    'expectedYieldKg',
    'soilHealthScore',
    'notes',
  ];

  fields.forEach((f) => {
    if (req.body[f] !== undefined) crop[f] = req.body[f];
  });

  await crop.save();
  sendSuccess(res, { crop }, 'Crop updated successfully');
});

export const logIrrigation = asyncHandler(async (req, res) => {
  const { amountLiters, method = 'Precision Drip', date } = req.body;
  const crop = await Crop.findById(req.params.id);
  if (!crop) throw new ApiError(404, 'Crop record not found');

  crop.irrigationLogs.push({
    date: date ? new Date(date) : new Date(),
    amountLiters: Number(amountLiters || 1000),
    method,
  });

  await crop.save();
  sendSuccess(res, { crop }, 'Irrigation session logged');
});

export const logFertilizer = asyncHandler(async (req, res) => {
  const { type = 'Organic Compost Tea', quantityKg, organic = true, date } = req.body;
  const crop = await Crop.findById(req.params.id);
  if (!crop) throw new ApiError(404, 'Crop record not found');

  crop.fertilizerLogs.push({
    date: date ? new Date(date) : new Date(),
    type,
    quantityKg: Number(quantityKg || 50),
    organic: Boolean(organic),
  });

  await crop.save();
  sendSuccess(res, { crop }, 'Fertilizer application logged');
});

export const deleteCrop = asyncHandler(async (req, res) => {
  const deleted = await Crop.findByIdAndDelete(req.params.id);
  if (!deleted) throw new ApiError(404, 'Crop not found');
  sendSuccess(res, {}, 'Crop record removed');
});

