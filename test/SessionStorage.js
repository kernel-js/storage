global.window = {};
require('mock-local-storage');
window.sessionStorage = global.sessionStorage;

import { expect } from 'chai';
import { SessionStorage } from '../src/index';

const sessionStorage = new SessionStorage();
sessionStorage.clear();

const date = new Date('1986-05-14');
const expired = new Date('1986-05-14');

describe('SessionStorage', () => {
  beforeEach(() => {
    expect(sessionStorage.set('key1', null)).to.equal(true);
    expect(sessionStorage.set('key2', 2)).to.equal(true);
    expect(sessionStorage.set('key3', 'Value 3')).to.equal(true);
    expect(sessionStorage.set('key4', date)).to.equal(true);
    expect(sessionStorage.set('key5', date, {expires: expired})).to.equal(true);
    expect(sessionStorage.set('key6', {a: 'a', b: {c: 'c'}})).to.equal(true);
    expect(sessionStorage.set('key6.e', {f: 'f'})).to.equal(true);
    expect(sessionStorage.set('key6.b.c.d', 0.75)).to.equal(true);
    expect(sessionStorage.set('key7.a', 1)).to.equal(true);
    expect(sessionStorage.set('key7.b', 2, {expires: expired})).to.equal(true);
  })

  afterEach(() => {
    sessionStorage.clear();
    sessionStorage.itemInsertionCallback = null;
  })

  it('all', () => {
    const all = sessionStorage.all();

    expect(all).to.deep.equal({
      "key1": null,
      "key2": 2,
      "key3": "Value 3",
      "key4": date,
      "key6": {a: 'a', b: {c: {d: 0.75}}, e: {f: 'f'}},
    });
  });

  it('has', () => {
    expect(sessionStorage.has('key1')).to.equal(true);
    expect(sessionStorage.has('key2')).to.equal(true);
    expect(sessionStorage.has('key5')).to.equal(false);
    expect(sessionStorage.has('key6.b.c')).to.equal(true);
    expect(sessionStorage.has('key6.a.d')).to.equal(false);
    expect(sessionStorage.has('key7')).to.equal(false);
  })

  it('get', () => {
    expect(sessionStorage.get('key1')).to.equal(null);
    expect(sessionStorage.get('key2')).to.equal(2);
    expect(sessionStorage.get('key3')).to.equal('Value 3');
    expect(sessionStorage.get('key4').toUTCString()).to.equal(date.toUTCString());
    expect(sessionStorage.get('key5')).to.equal(null);
    expect(sessionStorage.get('key5', 'Default Value')).to.equal('Default Value');
    expect(sessionStorage.get('key6')).to.deep.equal({a: 'a', b: {c: {d: 0.75}}, e: {f: 'f'}});
    expect(sessionStorage.get('key6.b')).to.deep.equal({c: {d: 0.75}});
    expect(sessionStorage.get('key6.b.c')).to.deep.equal({d: 0.75});
    expect(sessionStorage.get('key6.b.c.d')).to.equal(0.75);
    expect(sessionStorage.get('key6.b.c.f', 'Default Value')).to.equal('Default Value');
  });

  it('getMultiple', () => {
    expect(sessionStorage.getMultiple(['key1', 'key2', 'key8'])).to.deep.equal({
      "key1": null,
      "key2": 2,
      "key8": null,
    });

    expect(sessionStorage.getMultiple(['key1', 'key2', 'key8'], 'Default Value')).to.deep.equal({
      "key1": null,
      "key2": 2,
      "key8": 'Default Value',
    });
  });

  it('setMultiple', () => {
    expect(sessionStorage.setMultiple({key7: 'Value 7', key8: 'Value 8'})).to.equal(true);
    expect(sessionStorage.get('key7')).to.equal('Value 7');
    expect(sessionStorage.get('key8')).to.equal('Value 8');
  })

  it('delete', () => {
    expect(sessionStorage.delete('key2')).to.equal(true);
    expect(sessionStorage.get('key2')).to.equal(null);

    expect(sessionStorage.delete('key6.e')).to.equal(true);
    expect(sessionStorage.get('key6')).to.deep.equal({a: 'a', b: {c: {d: 0.75}}});

    expect(sessionStorage.delete('key6.b.c')).to.equal(true);
    expect(sessionStorage.get('key6')).to.deep.equal({a: 'a', b: {}});
  });

  it('deleteMultiple', () => {
    expect(sessionStorage.setMultiple({key7: 'Value 7', key8: 'Value 8'})).to.equal(true);
    expect(sessionStorage.get('key7')).to.equal('Value 7');
    expect(sessionStorage.get('key8')).to.equal('Value 8');
    expect(sessionStorage.deleteMultiple(['key7', 'key8'])).to.equal(true);
    expect(sessionStorage.get('key7')).to.equal(null);
    expect(sessionStorage.get('key8')).to.equal(null);
  })

  it('length', () => {
    expect(sessionStorage.length()).to.equal(5);
  })

  it('clear', () => {
    expect(sessionStorage.clear()).to.equal(true);
    expect(sessionStorage.length()).to.equal(0);
  })

  it('index', () => {
    expect(sessionStorage.index(0)).to.equal(null);
    expect(sessionStorage.index(1)).to.equal(2);
    expect(sessionStorage.index(2)).to.equal('Value 3');
    expect(sessionStorage.index(3)).to.deep.equal(date);
    expect(sessionStorage.index(4)).to.deep.equal({a: 'a', b: {c: {d: 0.75}}, e: {f: 'f'}});
    expect(sessionStorage.index(5)).to.equal(null);
    expect(sessionStorage.index(5, 'Default Value')).to.equal('Default Value');
  })

  it('isEmpty', () => {
    expect(sessionStorage.isEmpty()).to.equal(false);
    expect(sessionStorage.clear()).to.equal(true);
    expect(sessionStorage.isEmpty()).to.equal(true);
  })

});
