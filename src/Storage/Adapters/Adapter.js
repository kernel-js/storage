import AbstractAdapter from './AbstractAdapter'
import splitKeyHelper from "./Helpers/splitKey";
import { get, isEmpty, set, unset } from '@kernel-js/support';
import { TypeError, NotSupportedError, DataError } from '@kernel-js/exceptions';

const driver = new WeakMap();
const serializer = new WeakMap();
const keyPrefix = new WeakMap();
const encryptionKey = new WeakMap();
const encryptionMethod = new WeakMap();

export default class Adapter extends AbstractAdapter
{

  /**
   * Adapter constructor
   */
  constructor()
  {
    super();

    if (new.target === Adapter) {
      throw new TypeError('Cannot construct BaseAdapter instance directly.');
    }

    if (!this.hasSupport()) {
      throw new NotSupportedError(`${this.constructor.name} not available.`);
    }

    this.setKeyPrefix('kerneljs|');
    this.setSerializer(require('../Serializers/TypedSerializer').default);
  }

  /**
   * @inheritDoc
   */
  getDriver()
  {
    return driver.get(this);
  }

  /**
   * @inheritDoc
   */
  setDriver(value)
  {
    return driver.set(this, value);
  }

  /**
   * @inheritDoc
   */
  getKeyPrefix()
  {
    return keyPrefix.get(this);
  }

  /**
   * @inheritDoc
   */
  setKeyPrefix(value)
  {
    return keyPrefix.set(this, value);
  }

  /**
   * @inheritDoc
   */
  getSerializer()
  {
    return serializer.get(this);
  }

  /**
   * @inheritDoc
   */
  setSerializer(givenSerializer = null)
  {
    serializer.set(this, givenSerializer);
  }

  /**
   * @inheritDoc
   */
  getEncryptionKey()
  {
    return encryptionKey.get(this);
  }

  /**
   * @inheritDoc
   */
  setEncryptionKey(value)
  {
    return encryptionKey.set(this, value);
  }

  /**
   * @inheritDoc
   */
  getEncryptionMethod()
  {
    return encryptionMethod.get(this);
  }

  /**
   * @inheritDoc
   */
  setEncryptionMethod(value)
  {
    return encryptionMethod.set(this, value);
  }

  /**
   * @inheritDoc
   */
  hasSupport()
  {
    if (this.constructor.name === 'LocalStorageAdapter') {
      return window.localStorage !== undefined;
    } else if (this.constructor.name === 'SessionStorageAdapter') {
      return window.sessionStorage  !== undefined;
    } else if (this.constructor.name === 'WebCacheAdapter') {
      return window !== undefined;
    }

    return true;
  }

  /**
   * @inheritDoc
   */
  hasEventsSupport()
  {
    if (['LocalStorageAdapter', 'SessionStorageAdapter'].indexOf(this.constructor.name) !== -1) {
      return true;
    }

    return false;
  }

  /**
   * @inheritDoc
   */
  getUserKey(key)
  {
    return isEmpty(this.getKeyPrefix()) ? key : key.substr(this.getKeyPrefix().length, key.length);
  }

  /**
   * @inheritDoc
   */
  getKernelJSKey(key)
  {
    return isEmpty(this.getKeyPrefix()) ? key : `${this.getKeyPrefix()}${key}`;
  }

  /**
   * @inheritDoc
   */
  isKernelJSItem(key)
  {
    return key.substring(0, 9) === this.getKeyPrefix();
  }

  /**
   * @inheritDoc
   */
  all()
  {
    try {
      let keys = [],
        itemKey,
        len = this.getDriver().length;

      for (let i = 0; i < len; i++)
      {
        itemKey = this.getDriver().key(i);

        if (!this.isKernelJSItem(itemKey)) {
          continue;
        }

        if (this.isExpired(JSON.parse(this.getDriver().getItem(itemKey)))) {
          this.delete(itemKey);
          continue;
        }

        keys.push(itemKey);
      }

      return this.getMultiple(keys);

    } catch (e) {
      throw new DataError(e);
    }
  }

  /**
   * @inheritDoc
   */
  has(key)
  {
    try {
      let item, exists = false, itemKey, len = this.getDriver().length;
      const splitKey = splitKeyHelper(key);

      for (let i = 0; i < len; i++)
      {
        itemKey = this.getDriver().key(i);

        if (!this.isKernelJSItem(itemKey)) {
          continue;
        }

        if (key !== this.getUserKey(itemKey)) {
          continue;
        }

        exists = true;
      }

      item = this.getSerializer().deserialize(this.getDriver().getItem(this.getKernelJSKey(splitKey.root)));

      if (this.isExpired(JSON.parse(this.getDriver().getItem(this.getKernelJSKey(splitKey.root))))) {
        this.delete(splitKey.root);
        return false;
      }

      if (splitKey.nested === null) {
        return exists;
      }

      exists = get(item.value, splitKey.nested, '309e17f396019483e8505150f357832c') !== '309e17f396019483e8505150f357832c';

      return exists;

    } catch (e) {
      throw new DataError(e);
    }
  }

  /**
   * Fetches a value from the storage.
   *
   * @inheritDoc
   */
  get(key, defaultValue = null)
  {
    try {
      key = this.isKernelJSItem(key) ? key : this.getKernelJSKey(key);

      const splitKey = splitKeyHelper(key);
      let result = this.getSerializer().deserialize(this.getDriver().getItem(splitKey.root));

      if (isEmpty(result)) {
        return defaultValue;
      }

      if (this.isExpired(result)) {
        this.delete(splitKey.root);
        return defaultValue;
      }

      if (splitKey.nested === null) {
        return result.value;
      }

      return get(result.value, splitKey.nested, defaultValue);

    } catch (e) {
      throw new DataError(e);
    }
  }

  /**
   * @inheritDoc
   */
  getMultiple(keys, defaultValue = null)
  {
    try {
      let values = {};

      keys.forEach((key) => {
        values[!this.isKernelJSItem(key) ? key : this.getUserKey(key)] = this.get(key, defaultValue);
      });

      return values;

    } catch (e) {
      throw new DataError(e);
    }
  }

  /**
   * @inheritDoc
   */
  set(key, value, options = {})
  {
    try {
      const splitKey = splitKeyHelper(key);

      if (splitKey.nested === null) {
        this.setItem(splitKey.root, value, options);
        return true;
      }

      let current = this.get(splitKey.root),
        itemValue = set(current || {}, splitKey.nested, value);

      this.setItem(splitKey.root, itemValue, options);

      return true;

    } catch (e) {
      throw new DataError(e);
    }
  }

  /**
   * @inheritDoc
   */
  setMultiple(values, options = {})
  {
    try {
      Object.keys(values).forEach((key) => {
        this.set(key, values[key]);
      });

      return true;
    } catch (e) {
      throw new DataError(e);
    }
  }

  /**
   * @inheritDoc
   */
  delete(key, options = {})
  {
    try {
      const splitKey = splitKeyHelper(key);

      if (splitKey.nested === null) {
        this.getDriver().removeItem(`${this.getKeyPrefix()}${splitKey.root}`)
        return true;
      }

      const value = this.get(splitKey.root);

      unset(value, splitKey.nested)
      return this.set(splitKey.root, value);

    } catch (e) {
      throw new DataError(e);
    }
  }

  /**
   * @inheritDoc
   */
  deleteMultiple(keys, options = {})
  {
    try {
      keys.forEach((key) => {
        this.delete(key);
      });

      return true;
    } catch (e) {
      throw new DataError(e);
    }
  }

  /**
   * @inheritDoc
   */
  clear()
  {
    try {
      this.getDriver().clear();
      return true;
    } catch (e) {
      throw new DataError(e);
    }
  }

  /**
   * @inheritDoc
   */
  length()
  {
    try {
      return Object.keys(this.all()).length;
    } catch (e) {
      throw new DataError(e);
    }
  }

  /**
   * @inheritDoc
   */
  index(index, defaultValue = null)
  {
    const all = this.all(), length = Object.keys(all).length;

    if (index >= length) {
      return defaultValue;
    }

    try {
      let keys = [];

      for (let itemKey in all) {
        keys.push(itemKey);
      }

      return this.get(keys[index], defaultValue);
    } catch (e) {
      throw new DataError(e);
    }
  }

  /**
   * @inheritDoc
   */
  isEmpty()
  {
    return this.length() === 0;
  }

  /**
   * @inheritDoc
   */
  listen(closure, keys = [])
  {
    if (!this.hasEventsSupport()) {
      throw new NotSupportedError(`${this.constructor.name} events not available.`);
    }
  }

  /**
   * @private
   * @param key
   * @param value
   * @param options
   */
  setItem(key, value, options = {})
  {
    options.expires = this.getExpires(options);

    if (options.expires === null) {
      delete options['expires'];
    }

    this.getDriver().setItem(`${this.getKeyPrefix()}${key}`, this.getSerializer().serialize(value, options));
  }

  /**
   * @private
   * @param index
   */
  isExpired(item)
  {
    return item.options.expires !== undefined && item.options.expires !== undefined && new Date(item.options.expires) < new Date();
  }

  /**
   * @protected
   * @param options
   */
  getExpires(options = {})
  {
    if (options.expires === undefined) {
      return null;
    }

    if (Object.prototype.toString.call(options.expires) === '[object Date]') {
      return options.expires.toUTCString();
    }

    if (typeof options.expires === 'number') {
      let date = new Date();
      date.setMinutes(date.getMinutes() + options.expires);
      return date.toUTCString();
    }

    let date = new Date(options.expires)
    if (date instanceof Date && !isNaN(date)) {
      return date.toUTCString();
    }

    return null;
  }

}
