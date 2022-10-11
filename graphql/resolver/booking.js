const Booking = require("../../models/booking");
const { transformBooking } = require("./merge");

module.exports = {
  bookings: async (args, req) => {
    if (!req.isAuth) {
      throw new Error("Not Authorized");
    }
    try {
      const bookings = await Booking.find();
      return bookings.map((booking) => {
        return transformBooking(booking);
      });
    } catch (error) {
      throw error;
    }
  },
  bookEvent: async (args, req) => {
    if (!req.isAuth) {
      throw new Error("Not Authorized");
    }
    try {
      const { eventId } = args;
      const fetchedEvent = await Event.findOne({ id: eventId });

      const booking = await new Booking({
        user: req.userId,
        event: fetchedEvent,
      });

      const result = await booking.save();
      return transformBooking(result);
    } catch (error) {}
  },
  cancelBooking: async (args, req) => {
    if (!req.isAuth) {
      throw new Error("Not Authorized");
    }
    try {
      const { bookingId } = args;
      const booking = await Booking.findById(bookingId).populate("event");
      const event = transformEvent(booking.event);

      await Booking.deleteOne({ _id: bookingId });
      return event;
    } catch (error) {
      throw error;
    }
  },
};
