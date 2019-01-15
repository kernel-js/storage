import Storage from "./Storage/Storage";

export default class SessionStorage extends Storage
{

  /**
   * Cookies constructor
   *
   * @param {function}                      closure            Optional. The function to be called when changes occurs
   *                                                           by another instance.
   * @param {array}                         keys               Optional. If you want to specify only some keys to watch.
   */
  constructor(closure = null, keys = [])
  {
    super('SessionStorageAdapter', closure, keys);
  }

}
