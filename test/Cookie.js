let window = require('mock-cookie').Document;
global.document = new window();

import { expect } from 'chai';
import { Cookie } from '../src/index';

const cookie = new Cookie();
cookie.clear();

const date = new Date('1986-05-14');
const expired = new Date('1986-05-14');

describe('Cookie', () => {
  beforeEach(() => {
    expect(cookie.set('key1', null)).to.equal(true);
    expect(cookie.set('key2', 2)).to.equal(true);
    expect(cookie.set('key3', 'Value 3')).to.equal(true);
    expect(cookie.set('key4', date)).to.equal(true);
    expect(cookie.set('key5', date, {expires: expired})).to.equal(true);
    expect(cookie.set('key6', {a: 'a', b: {c: 'c'}})).to.equal(true);
    expect(cookie.set('key6.e', {f: 'f'})).to.equal(true);
    expect(cookie.set('key6.b.c.d', 0.75)).to.equal(true);
    expect(cookie.set('key7.a', 1)).to.equal(true);
    expect(cookie.set('key7.b', 2, {expires: expired})).to.equal(true);
  })

  afterEach(() => {
    cookie.clear();
    cookie.itemInsertionCallback = null;
  })

  it('all', () => {
    const all = cookie.all();

    expect(all).to.deep.equal({
      "key1": null,
      "key2": 2,
      "key3": "Value 3",
      "key4": date,
      "key6": {a: 'a', b: {c: {d: 0.75}}, e: {f: 'f'}},
    });
  });

  it('has', () => {
    expect(cookie.has('key1')).to.equal(true);
    expect(cookie.has('key2')).to.equal(true);
    expect(cookie.has('key5')).to.equal(false);
    expect(cookie.has('key6.b.c')).to.equal(true);
    expect(cookie.has('key6.a.d')).to.equal(false);
    expect(cookie.has('key7')).to.equal(false);
  })

  it('get', () => {
    expect(cookie.get('key1')).to.equal(null);
    expect(cookie.get('key2')).to.equal(2);
    expect(cookie.get('key3')).to.equal('Value 3');
    expect(cookie.get('key4').toUTCString()).to.equal(date.toUTCString());
    expect(cookie.get('key5')).to.equal(null);
    expect(cookie.get('key5', 'Default Value')).to.equal('Default Value');
    expect(cookie.get('key6')).to.deep.equal({a: 'a', b: {c: {d: 0.75}}, e: {f: 'f'}});
    expect(cookie.get('key6.b')).to.deep.equal({c: {d: 0.75}});
    expect(cookie.get('key6.b.c')).to.deep.equal({d: 0.75});
    expect(cookie.get('key6.b.c.d')).to.equal(0.75);
    expect(cookie.get('key6.b.c.f', 'Default Value')).to.equal('Default Value');
  });

  it('getMultiple', () => {
    expect(cookie.getMultiple(['key1', 'key2', 'key8'])).to.deep.equal({
      "key1": null,
      "key2": 2,
      "key8": null,
    });

    expect(cookie.getMultiple(['key1', 'key2', 'key8'], 'Default Value')).to.deep.equal({
      "key1": null,
      "key2": 2,
      "key8": 'Default Value',
    });
  });

  it('setMultiple', () => {
    expect(cookie.setMultiple({key7: 'Value 7', key8: 'Value 8'})).to.equal(true);
    expect(cookie.get('key7')).to.equal('Value 7');
    expect(cookie.get('key8')).to.equal('Value 8');
  })

  it('delete', () => {
    expect(cookie.delete('key2')).to.equal(true);
    expect(cookie.get('key2')).to.equal(null);

    expect(cookie.delete('key6.e')).to.equal(true);
    expect(cookie.get('key6')).to.deep.equal({a: 'a', b: {c: {d: 0.75}}});

    expect(cookie.delete('key6.b.c')).to.equal(true);
    expect(cookie.get('key6')).to.deep.equal({a: 'a', b: {}});
  });

  it('deleteMultiple', () => {
    expect(cookie.setMultiple({key7: 'Value 7', key8: 'Value 8'})).to.equal(true);
    expect(cookie.get('key7')).to.equal('Value 7');
    expect(cookie.get('key8')).to.equal('Value 8');
    expect(cookie.deleteMultiple(['key7', 'key8'])).to.equal(true);
    expect(cookie.get('key7')).to.equal(null);
    expect(cookie.get('key8')).to.equal(null);
  })

  it('length', () => {
    expect(cookie.length()).to.equal(5);
  })

  it('clear', () => {
    expect(cookie.clear()).to.equal(true);
    expect(cookie.length()).to.equal(0);
  })

  it('index', () => {
    expect(cookie.index(0)).to.equal(null);
    expect(cookie.index(1)).to.equal(2);
    expect(cookie.index(2)).to.equal('Value 3');
    expect(cookie.index(3)).to.deep.equal(date);
    expect(cookie.index(4)).to.deep.equal({a: 'a', b: {c: {d: 0.75}}, e: {f: 'f'}});
    expect(cookie.index(5)).to.equal(null);
    expect(cookie.index(5, 'Default Value')).to.equal('Default Value');
  })

  it('isEmpty', () => {
    expect(cookie.isEmpty()).to.equal(false);
    expect(cookie.clear()).to.equal(true);
    expect(cookie.isEmpty()).to.equal(true);
  })

});
