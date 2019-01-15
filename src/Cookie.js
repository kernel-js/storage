import Storage from "./Storage/Storage";

export default class Cookie extends Storage
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
    super('CookieAdapter', closure, keys);
  }

}
