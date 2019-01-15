import AbstractSerializer from './AbstractSerializer';

export default class TypedSerializer extends AbstractSerializer
{

  static serialize(value, options = null)
  {
    let dataType = 'unknown';

    if (Object.prototype.toString.call(value) === '[object Date]') {
      dataType = 'date';
      value = value.toUTCString();
    } else if (Object.prototype.toString.call(value) === '[object RegExp]') {
      dataType = 'regex';
      value = value.source;
    } else if (typeof value === 'function') {
      dataType = 'function';
      value = value.toString();
    } else {
      dataType = typeof value;
    }

    return options !== null
      ? JSON.stringify({dataType, value, options})
      : JSON.stringify({dataType, value});
  }

  static deserialize(value)
  {
    if (value === null) {
      return null;
    }

    let json = JSON.parse(value);

    if (json.dataType === 'date') {
      json.value = new Date(json.value);
    } else if (json.dataType === 'regex') {
      json.value = new RegExp(json.value);
    } else if (json.dataType === 'function') {
      json.value = '' + json.value;
    } else if (json.dataType === 'boolean') {
      json.value = Boolean(json.value);
    }

    delete json['dataType'];

    return json;
  }

}
