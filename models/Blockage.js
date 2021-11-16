let data = [];

/**
 * @typedef Blockage
 * @prop {number[]} location // [longitude, latitude] of location
 * @prop {number} time // current time represented by milliseconds
 * @prop {string} reporter // the username of the reporter
 * @prop {string} description // description of blockage
 * @prop {string} status // status of blockage
 */

/**
 * @class Blockage
 * 
 * Stores all Blockages. Note that all methods are static.
 * Wherever you import this class, you will be accessing the same data.
 */
class Blockage {

  /**
   * Get all blockages from the collection
   * 
   * @returns {Blockage[]} - the list of blockages
   */
  static getAll() {
    return data;
  }

  /**
   * Add a Blockage to the collection.
   * 
   * @param {string} content - text of the freet, with length > 0 and <= 140
   * @param {number} userID - unique ID of the user who wrote this freet
   * @return {User} - the newly created user
   */
  static addOne(location, time, reporter, description, status) {
    const blockage = {
        "location": location,
        "time": time,
        "reporter": reporter,
        "description": description,
        "status": status,
    }; 
    data.push(blockage);
    return data;
  }
}

module.exports = Blockage;