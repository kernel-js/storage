import Adapter from './Adapter';
import { get, isEmpty } from "@kernel-js/support";
import splitKeyHelper from "./Helpers/splitKey";
import { DataError } from "@kernel-js/exceptions";

export default class CookieAdapter extends Adapter
{

  /**
   * LocalStorageAdapter constructor
   */
  constructor()
  {
    super();

    this.setDriver(require('../Drivers/Cookie').default);
  }

  /**
   * @inheritDoc
   */
  all()
  {
    try {
      const all = this.getDriver().all();
      let keys = [];

      for (let itemKey in all)
      {
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
      const all = this.getDriver().all();
      let item, exists = false;
      const splitKey = splitKeyHelper(key);

      for (let itemKey in all)
      {
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
   * @inheritDoc
   */
  clear()
  {
    try {
      const all = this.all();

      for (let itemKey in all) {
        this.delete(itemKey);
      }

      return true;
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
        keys.unshift(itemKey);
      }

      return this.get(keys[index], defaultValue);
    } catch (e) {
      throw new DataError(e);
    }
  }

  /**
   * @inheritDoc
   */
  listen(closure, keys = [])
  {
    super.listen(closure, keys);
  }

}

