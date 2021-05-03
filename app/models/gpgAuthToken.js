/**
 * Passbolt ~ Open source password manager for teams
 * Copyright (c) Passbolt SA (https://www.passbolt.com)
 *
 * Licensed under GNU Affero General Public License version 3 of the or any later version.
 * For full copyright and license information, please see the LICENSE.txt
 * Redistributions of files must retain the above copyright notice.
 *
 * @copyright     Copyright (c) Passbolt SA (https://www.passbolt.com)
 * @license       https://opensource.org/licenses/AGPL-3.0 AGPL License
 * @link          https://www.passbolt.com Passbolt(tm)
 */
const Model = require('./model.js');
const Crypto = require('../models/crypto.js');
const validator = require('validator');

class GpgAuthToken extends Model {
  /**
   * Constructor
   * @param token string
   */
  constructor(token) {
    super();
    if (token === undefined) {
      this._token = 'gpgauthv1.3.0|36|';
      this._token += Crypto.uuid();
      this._token += '|gpgauthv1.3.0';
    } else {
      const result = this.validate('token', token);
      if (result === true) {
        this._token = token;
      } else {
        throw result;
      }
    }
  }

  /**
   * Get gpg auth token text
   * @returns string token
   */
  get token() {
    return this._token;
  }

  /**
   * Validate user fields individually
   * @param field string
   * @param value string
   * @return {*} true or Error
   */
  static validate(field, value) {
    let sections;
    switch (field) {
      case 'token' :
        if (typeof value === 'undefined' || value === '') {
          return new Error('The user authentication token cannot be empty');
        }
        sections = value.split('|');
        if (sections.length !== 4) {
          return new Error('The user authentication token is not in the right format');
        }
        if (sections[0] !== sections[3] && sections[0] !== 'gpgauthv1.3.0') {
          return new Error('Passbolt does not support this GPGAuth version');
        }
        if (sections[1] !== '36') {
          return new Error(`Passbolt does not support GPGAuth token nonce longer than 36 characters: ${sections[2]}`);
        }
        if (!validator.isUUID(sections[2])) {
          return new Error('Passbolt does not support GPGAuth token nonce that are not UUIDs');
        }
        return true;
      default :
        return new Error(`No validation defined for field: ${field}`);
    }
  }
}

module.exports = GpgAuthToken;
