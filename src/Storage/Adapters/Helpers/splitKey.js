import {isEmpty} from "@kernel-js/support";

/**
 *
 * @param  {string}        key
 * @return {object}
 */
const splitKey = (key) =>
{
  let keyParts = key.split('.');
  const root = keyParts[0];

  delete keyParts.splice(0, 1);

  return {
    root: root,
    nested: isEmpty(keyParts) ? null : keyParts.join('.')
  };

};

export default splitKey;
