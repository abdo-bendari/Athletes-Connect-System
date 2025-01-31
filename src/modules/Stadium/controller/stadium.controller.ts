import Stadium from "../../../../database/models/Stadium";
import catchError from "../../../middleware/catchError";
import { AppError } from "../../../utils/Error";
import { Request, Response ,NextFunction} from "express";


export const addStadium = catchError(async (req: Request, res: Response, next: NextFunction) => {
  const {
    name,
    address,
    sportType,
    capacity,
    pricePerHour,
    owner,
    location,
    facilities,
    imageUrl,
    isIndoor,
    availableSlots,
  } = req.body;

  if (!name || !address || !sportType || !capacity || !pricePerHour || !owner) {
    return next(new AppError("Please provide all required fields", 400));
  }

  const stadium = new Stadium({
    name,
    address,
    sportType,
    capacity,
    pricePerHour,
    owner,
    location,
    facilities,
    imageUrl,
    isIndoor,
    availableSlots,
  });

  await stadium.save();
  return res.status(201).json({ message: "Stadium added successfully", stadium });
});

export const getNearbyStadiums = catchError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { longitude, latitude, maxDistance } = req.query;

    if (!longitude || !latitude) {
      return next(new AppError("Please provide longitude and latitude", 400));
    }

    const distance = maxDistance ? parseInt(maxDistance as string, 10) : 5000; // Default: 5km

    const stadiums = await Stadium.aggregate([
      {
        $geoNear: {
          near: {
            type: "Point",
            coordinates: [parseFloat(longitude as string), parseFloat(latitude as string)],
          },
          distanceField: "distance",
          spherical: true,
          maxDistance: distance, // Maximum distance in meters
        },
      },
    ]);

    res.status(200).json({ message : "Success" , stadiums });
  }
);


export const getAllStadiums = catchError(async (req: Request, res: Response, next: NextFunction) => {
  const stadiums = await Stadium.find();
  if (stadiums.length === 0) {
    return next(new AppError("No stadiums found", 404));
  }
  return res.status(200).json({ message: "Success", totalCount: stadiums.length, stadiums });
});

export const getStadiumByIdOrName = catchError(async (req: Request, res: Response, next: NextFunction) => {
  const { id, name } = req.query;
  if (!id && !name) {
    return next(new AppError("Please provide stadium ID or name", 400));
  }

  const stadium = await Stadium.findOne({
    $or: [{ _id: id }, { name: name }],
  });

  if (!stadium) {
    return next(new AppError("Stadium not found", 404));
  }

  return res.status(200).json({ message: "Success", stadium });
});

export const updateStadium = catchError(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  if (!id) {
    return next(new AppError("Please provide stadium ID", 400));
  }

  const stadium = await Stadium.findByIdAndUpdate(id, req.body, { new: true });
  if (!stadium) {
    return next(new AppError("Stadium not found", 404));
  }

  return res.status(200).json({ message: "Stadium updated successfully", stadium });
});

export const deleteStadium = catchError(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  if (!id) {
    return next(new AppError("Please provide stadium ID", 400));
  }

  const stadium = await Stadium.findByIdAndDelete(id);
  if (!stadium) {
    return next(new AppError("Stadium not found", 404));
  }

  return res.status(200).json({ message: "Stadium deleted successfully" });
});

export const getStadiumsBySportType = catchError(async (req: Request, res: Response, next: NextFunction) => {
  const { sportType } = req.query;
  if (!sportType) {
    return next(new AppError("Please provide sport type", 400));
  }

  const stadiums = await Stadium.find({ sportType });
  if (stadiums.length === 0) {
    return next(new AppError("No stadiums found for this sport type", 404));
  }

  return res.status(200).json({ message: "Success", stadiums });
});

export const reserveSlot = catchError(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const { slot } = req.body;

  if (!id || !slot) {
    return next(new AppError("Please provide stadium ID and slot", 400));
  }

  const stadium = await Stadium.findById(id);
  if (!stadium) {
    return next(new AppError("Stadium not found", 404));
  }

  if (!stadium.availableSlots.includes(slot)) {
    return next(new AppError("Slot not available", 400));
  }

  stadium.availableSlots = stadium.availableSlots.filter((s) => s !== slot);
  await stadium.save();

  return res.status(200).json({ message: "Slot reserved successfully", stadium });
});
