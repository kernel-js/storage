import AbstractAdapter from './Adapters/Adapter';
import {TypeError} from '@kernel-js/exceptions';

const currentAdapter = new WeakMap();

export default class Storage
{

  /**
   * Storage constructor
   *
   * @param {null|string|object|function}   adapter        The adapter to use. Can be LocalStorageAdapter (default),
   *                                                       SessionStorageAdapter or CookieAdapter
   * @param {boolean}                       encrypted      Optional. If you want values to be encrypted before save.
   * @param {function}                      closure        Optional. The function to be called when changes occurs by another instance.
   * @param {array}                         keys           Optional. If you want to specify only some keys to watch.
   */
  constructor(adapter = 'LocalStorageAdapter', encrypted = false, closure = null, keys = [])
  {
    if (typeof adapter === 'string') {
      adapter = this.createAdapterFromName(adapter);
    }

    if (!(adapter instanceof AbstractAdapter)) {
      throw new TypeError('Please provide a valid adapter.');
    }

    this.setAdapter(adapter);

    if (typeof closure === 'function') {
      this.listen(closure, keys);
    }
  }

  /**
   * @param adapterName
   * @returns {*}
   */
  createAdapterFromName(adapterName)
  {
    return new (require(`./Adapters/${adapterName}`).default)();
  }

  /**
   * Get current adapter
   *
   * @return {AbstractAdapter}
   */
  getAdapter()
  {
    return currentAdapter.get(this);
  }

  /**
   * Set current adapter
   *
   * @param {null|string|object|function}   adapter        The adapter to use. Can be LocalStorageAdapter (default),
   *                                                       SessionStorageAdapter, CookiesAdapter or a custom.
   */
  setAdapter(adapter)
  {
    currentAdapter.set(this, adapter);
  }

  /**
   * Get all items from storage.
   *
   * @returns {*}
   *
   * @throws  {DataError}
   */
  all()
  {
    return this.getAdapter().all();
  }

  /**
   * Determines whether an item is present in the storage.
   *
   * NOTE: It is recommended that has() is only to be used for storage warming type purposes
   * and not to be used within your live applications operations for getValue/set, as this method
   * is subject to a race condition where your has() will return true and immediately after,
   * another script can remove it making the state of your app out of date.
   *
   * @param   {string}     key           The storage item key.
   *
   * @returns {boolean}
   *
   * @throws  {DataError}
   */
  has(key)
  {
    return this.getAdapter().has(key);
  }

  /**
   * Fetches a value from the storage.
   *
   * @param   {string}     key           The unique key of this item in the storage.
   *                                     You can use dot notation on nested objects.
   * @param   {*}          defaultValue  Optional. Default value to return if the key does not exist or is null.
   *
   * @returns {*}                        The value of the item from the storage, or default in case of item miss.
   *
   * @throws  {DataError}
   */
  get(key, defaultValue = null)
  {
    return this.getAdapter().get(key, defaultValue);
  }

  /**
   * Obtains multiple storage items by their unique keys.
   *
   * @param   {array}      keys          A list of keys that can obtained in a single operation.
   *                                     You can use dot notation on nested objects.
   * @param   {*}          defaultValue  Optional. Default value to return for keys that do not exist.
   *
   * @returns {object}                   An object with all key => value pairs.
   *                                     Keys that do not exist or is null will have defaultValue as value.
   *
   * @throws  {DataError}
   */
  getMultiple(keys, defaultValue = null)
  {
    return this.getAdapter().getMultiple(keys, defaultValue);
  }

  /**
   * Persists data in the storage, uniquely referenced by a key.
   *
   * @param   {string}     key           The key of the item to store.
   *                                     You can use dot notation on nested objects to change just a specific property.
   * @param   {*}          value         The value of the item to store, must be serializable.
   * @param   {object}     options       Optional configs. Not all adapters support it.
   *
   * @returns {boolean}
   *
   * @throws  {DataError}
   */
  set(key, value, options = {})
  {
    return this.getAdapter().set(key, value, options);
  }

  /**
   * Persists a set of key => value pairs in the storage.
   *
   * @param   {object}     values        An object with all key => value pairs for a multiple-set operation.
   *                                     You can use dot notation on nested objects to change just a specific property.
   * @param   {object}     options       Optional configs. Not all adapters support it.
   *
   * @returns {boolean}
   *
   * @throws  {DataError}
   */
  setMultiple(values, options = {})
  {
    return this.getAdapter().setMultiple(values, options);
  }

  /**
   * Delete an item from the storage by its unique key.
   *
   * @param   {string}     key           The unique storage key of the item to delete.
   *                                     You can use dot notation on nested objects to delete just a specific property.
   * @param   {object}     options       Optional configs. Not all adapters support it.
   *
   * @returns {boolean}
   *
   * @throws  {DataError}
   */
  delete(key, options = {})
  {
    return this.getAdapter().delete(key, options);
  }

  /**
   * Deletes multiple storage items in a single operation.
   *
   * @param   {array}      values        A list of unique keys for a multiple-delete operation.
   *                                     You can use dot notation on nested objects to delete just a specific property.
   * @param   {object}     options       Optional configs. Not all adapters support it.
   *
   * @returns {boolean}
   *
   * @throws  {DataError}
   */
  deleteMultiple(keys, options = {})
  {
    return this.getAdapter().deleteMultiple(keys, options);
  }

  /**
   * Wipes clean the entire storage's keys.
   *
   * @returns {boolean}
   *
   * @throws  {DataError}
   */
  clear()
  {
    return this.getAdapter().clear();
  }

  /**
   * Returns entire storage's keys count.
   *
   * @returns {number}
   *
   * @throws  {DataError}
   */
  length()
  {
    return this.getAdapter().length();
  }

  /**
   * Get value at specific numeric index
   *
   * @param   {number}     index         The numeric index of the value on storage.
   * @param   {*}          defaultValue  Optional. Default value to return for indexes that do not exist.
   *
   * @returns {*}
   *
   * @throws  {DataError}
   */
  index(index, defaultValue = null)
  {
    return this.getAdapter().index(index, defaultValue);
  }

  /**
   * Returns if storage is empty.
   *
   * @returns {boolean}
   *
   * @throws  {DataError}
   */
  isEmpty()
  {
    return this.getAdapter().isEmpty();
  }

  /**
   * Listen for changes made by another instances.
   *
   * @param   {function}   closure       The function to be called when changes occurs by another instance.
   * @param   {array}      keys          Optional. If you want to specify only some keys to watch.
   *
   * @returns {*}
   */
  listen(closure, keys = [])
  {
    this.getAdapter().listen(closure, keys);

    return this;
  }

  deleteExpired()
  {
    this.getAdapter().deleteExpired();

    return this;
  }

}
