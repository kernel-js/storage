import Adapter from './Adapter';
import { isEmpty } from "@kernel-js/support";

export default class SessionStorageAdapter extends Adapter
{

  /**
   * LocalStorageAdapter constructor
   */
  constructor()
  {
    super();

    this.setDriver(require('../Drivers/SessionStorage').default);
  }

  /**
   * @inheritDoc
   */
  listen(closure, keys = [])
  {
    super.listen(closure, keys);

    if (window.addEventListener) {
      window.addEventListener('storage', (e) => {
        if (typeof closure === 'function' && (isEmpty(keys) || keys.indexOf(e.key) !== -1)) {
          closure(e);
        }
      })
    } else if (window.attachEvent) {
      window.attachEvent('onstorage', (e) => {
        if (typeof closure === 'function' && (isEmpty(keys) || keys.indexOf(e.key) !== -1)) {
          closure(e);
        }
      })
    }
  }

}
