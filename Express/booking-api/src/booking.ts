export type Entity = {
  data: string;
  isAvailable: boolean;
  timeBooked?: Date;
  timeSpanForBooking: { start: Date; end: Date };
  unavailableTimeSpan?: { start: Date; end: Date }[];
  uuid: string;
};

const entity: Entity = {
  uuid: "123",
  data: "data",
  isAvailable: true,
  timeSpanForBooking: { start: new Date(), end: new Date() },
  unavailableTimeSpan: [],
};

// create list of entities
const entities: Entity[] = [entity, entity, entity];

// array to store the entities that are available
const availableEntities: Entity[] = entities.filter(
  (entity) => entity.isAvailable,
);

// array to store the entities that are not available
const notAvailableEntities: Entity[] = entities.filter(
  (entity) => !entity.isAvailable,
);

export const BookingAlgorithm = (
  entities: Entity[],
  timeSpan: { start: Date; end: Date },
  entityUUID: string,
) => {
  // find entity by uuid
  const entity = entities.find((entity) => entity.uuid === entityUUID);

  if (!entity) {
    return { status: "error", message: "Entity not found" };
  }

  // check if entity is available
  if (entity.isAvailable) {
    // check if the timeSpan is within the entity's booking window
    if (
      timeSpan.start >= entity.timeSpanForBooking.start &&
      timeSpan.end <= entity.timeSpanForBooking.end
    ) {
      // check if the timeSpan overlaps with any unavailable time spans
      if (
        entity.unavailableTimeSpan &&
        entity.unavailableTimeSpan.some(
          (unavailable) =>
            timeSpan.start < unavailable.end &&
            timeSpan.end > unavailable.start,
        )
      ) {
        return {
          status: "error",
          message: "Entity is not available at this time",
        };
      }

      // book the entity
      entity.timeBooked = timeSpan.start;
      entity.isAvailable = false;
      return { status: "success", message: "Entity has been booked" };
    }

    return {
      status: "error",
      message: "Requested time span is outside of booking window",
    };
  }

  return { status: "error", message: "Entity is not available for booking" };
};

// Example usage:
const timeSpan = { start: new Date(), end: new Date() };
const bookingResult = BookingAlgorithm(entities, timeSpan, "123");
console.log(bookingResult);

// Implementing the ranking algorithm
//
//
export const weights = {
  bookingTime: 0.29,
  userPriority: 0.24,
  userCredibility: 0.19,
  categoryRanking: 0.14,
  locationDesirability: 0.1,
  bookingFrequency: 0.05,
};

const normalizeBookingTime = (bookingTime: Date, desiredStartTime: Date) => {
  const timeDifference =
    (desiredStartTime.getTime() - bookingTime.getTime()) /
    (1000 * 60 * 60 * 24); // in days
  return 1 / (1 + timeDifference); // Normalized value between 0 and 1
};

// Will be improved for dynamic supply of user statuses and their corresponding normalized priority values
const userPriorityScore = (userStatus: string) => {
  const priorities = { VIP: 1, Regular: 0.5, New: 0.2 };
  return priorities[userStatus] || 0.2; // Default to New User score
};

// the number of booking and maxbookings are subject to a time frame
const normalizeBookingFrequency = (
  userBookings: number,
  maxBookings: number,
) => {
  return userBookings / maxBookings; // Normalized value between 0 and 1
};

// Improvements here are similar to those for user priority
const locationDesirabilityScore = (location: string) => {
  const desirability = {
    PrimeLocation: 0.8,
    StandardLocation: 0.5,
    RemoteLocation: 0.3,
  };
  return desirability[location] || 0.5; // Default to StandardLocation score
};

const normalizeCategoryRank = (categoryRank: number, maxRank: number) => {
  return 1 - (categoryRank - 1) / (maxRank - 1); // Invert the rank so that lower ranks give higher scores
};

const normalizeUserCredibility = (
  userCredibility: number,
  maxCredibility: number = 100,
) => {
  return userCredibility / maxCredibility; // Normalized to a range of 0 to 1
};

export const calculateRankingScore = (
  bookingTime: Date,
  desiredStartTime: Date,
  userStatus: string,
  userCredibility: number,
  categoryRank: number,
  location: string,
  userBookings: number,
  maxBookings: number,
  weights: any,
) => {
  const bookingTimeScore = normalizeBookingTime(bookingTime, desiredStartTime);
  const priorityScore = userPriorityScore(userStatus);
  const credibilityScore = normalizeUserCredibility(userCredibility);
  const categoryScore = normalizeCategoryRank(categoryRank, 10);
  const desirabilityScore = locationDesirabilityScore(location);
  const frequencyScore = normalizeBookingFrequency(userBookings, maxBookings);

  return (
    weights.bookingTime * bookingTimeScore +
    weights.userPriority * priorityScore +
    weights.userCredibility * credibilityScore +
    weights.categoryRanking * categoryScore +
    weights.locationDesirability * desirabilityScore +
    weights.bookingFrequency * frequencyScore
  );
};
