export default class AbstractAdapter
{

  /**
   * Adapter constructor
   */
  constructor()
  {
    if (new.target === AbstractAdapter) {
      throw new TypeError('Cannot construct Adapter instance directly.');
    }
  }

  /**
   * Get current keyPrefix.
   *
   * @return {string}
   */
  getDriver(){}

  /**
   * Set current driver.
   *
   * @param {object|function}
   */
  setDriver(value){}

  /**
   * Get current keyPrefix.
   *
   * @return {string}
   */
  getKeyPrefix(){}

  /**
   * Set current keyPrefix.
   *
   * @param {string}
   */
  setKeyPrefix(value){}

  /**
   * Get current serializer.
   *
   * @returns {AbstractSerializer}
   */
  getSerializer(){}

  /**
   * Set current serializer.
   *
   * @param {AbstractSerializer}   givenSerializer
   */
  setSerializer(givenSerializer = null){}

  /**
   * Get encryption key.
   *
   * @return {string}
   */
  getEncryptionKey(){}

  /**
   * Set encryption key.
   *
   * @param {string}
   */
  setEncryptionKey(value){}

  /**
   * Get encryption method.
   *
   * @return {string}
   */
  getEncryptionMethod(){}

  /**
   * Set encryption method.
   *
   * @param {string}
   */
  setEncryptionMethod(value){}

  /**
   * Determines if current adapter is supported.
   *
   * @protected
   * @returns {boolean}
   */
  hasSupport(){}

  /**
   * Determines if current adapter has support to events.
   *
   * @returns {boolean}
   */
  hasEventsSupport(){}

  /**
   *
   * @param   {string}     key           The unique key of this item in the storage.
   * @returns {string}                   If keyPrefix's not empty then result will be both concatenated, else just the informed key.
   */
  getUserKey(key){}

  /**
   *
   * @param   {string}     key           The unique key of this item in the storage.
   * @returns {string}                   If keyPrefix's not empty then result will be both concatenated, else just the informed key.
   */
  getKernelJSKey(key){}

  /**
   *
   * @param   {string} key
   * @returns {boolean}
   */
  isKernelJSItem(key){}

  /**
   * Get all items from storage.
   *
   * @returns {*}
   *
   * @throws  {DataError}
   */
  all(){}

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
  has(key){}

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
  get(key, defaultValue = null){}

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
  getMultiple(keys, defaultValue = null){}

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
  set(key, value, options = {}){}

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
  setMultiple(values, options = {}){}

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
  delete(key, options = {}){}

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
  deleteMultiple(keys, options = {}){}

  /**
   * Wipes clean the entire storage's keys.
   *
   * @returns {boolean}
   *
   * @throws  {DataError}
   */
  clear(){}

  /**
   * Returns entire storage's keys count.
   *
   * @returns {number}
   *
   * @throws  {DataError}
   */
  length(){}

  /**
   * Get value at specific numeric index
   *
   * @param   {number}     index         The numeric index of the value on storage.
   * @param   {*}          defaultValue  Optional. Default value to return when index does not exist.
   *
   * @returns {*}
   *
   * @throws  {DataError}
   */
  index(index, defaultValue = null){}

  /**
   * Returns if storage is empty.
   *
   * @returns {boolean}
   *
   * @throws  {DataError}
   */
  isEmpty(){}

  /**
   * Listen for changes made by another instances.
   *
   * @param   {function}   closure       The function to be called when changes occurs by another instance.
   * @param   {array}      keys          Optional. If you want to specify only some keys to watch.
   *
   * @returns {*}
   */
  listen(closure, keys = []){}

}
