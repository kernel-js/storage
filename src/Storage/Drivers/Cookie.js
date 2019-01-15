const BrowserCookies = require('browser-cookies');

class Cookie
{
  all()
  {
    return BrowserCookies.all();
  }

  getItem(key)
  {
    return BrowserCookies.get(key);
  }

  setItem(name, value, options = {})
  {
    return BrowserCookies.set(name, value, options);
  }

  removeItem(name, options)
  {
    return BrowserCookies.erase(name, options);
  }

  length()
  {
    return Object.keys(BrowserCookies.all());
  }
}

export default new Cookie();
