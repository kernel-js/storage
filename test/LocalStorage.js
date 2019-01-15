global.window = {};
require('mock-local-storage');
window.localStorage = global.localStorage;

import { expect } from 'chai';
import { LocalStorage } from '../src/index';

const localStorage = new LocalStorage();
localStorage.clear();

const date = new Date('1986-05-14');
const expired = new Date('1986-05-14');

describe('LocalStorage', () => {
  beforeEach(() => {
    expect(localStorage.set('key1', null)).to.equal(true);
    expect(localStorage.set('key2', 2)).to.equal(true);
    expect(localStorage.set('key3', 'Value 3')).to.equal(true);
    expect(localStorage.set('key4', date)).to.equal(true);
    expect(localStorage.set('key5', date, {expires: expired})).to.equal(true);
    expect(localStorage.set('key6', {a: 'a', b: {c: 'c'}})).to.equal(true);
    expect(localStorage.set('key6.e', {f: 'f'})).to.equal(true);
    expect(localStorage.set('key6.b.c.d', 0.75)).to.equal(true);
    expect(localStorage.set('key7.a', 1)).to.equal(true);
    expect(localStorage.set('key7.b', 2, {expires: expired})).to.equal(true);
  })

  afterEach(() => {
    localStorage.clear();
    localStorage.itemInsertionCallback = null;
  })

  it('all', () => {
    const all = localStorage.all();

    expect(all).to.deep.equal({
      "key1": null,
      "key2": 2,
      "key3": "Value 3",
      "key4": date,
      "key6": {a: 'a', b: {c: {d: 0.75}}, e: {f: 'f'}},
    });
  });

  it('has', () => {
    expect(localStorage.has('key1')).to.equal(true);
    expect(localStorage.has('key2')).to.equal(true);
    expect(localStorage.has('key5')).to.equal(false);
    expect(localStorage.has('key6.b.c')).to.equal(true);
    expect(localStorage.has('key6.a.d')).to.equal(false);
    expect(localStorage.has('key7')).to.equal(false);
  })

  it('get', () => {
    expect(localStorage.get('key1')).to.equal(null);
    expect(localStorage.get('key2')).to.equal(2);
    expect(localStorage.get('key3')).to.equal('Value 3');
    expect(localStorage.get('key4').toUTCString()).to.equal(date.toUTCString());
    expect(localStorage.get('key5')).to.equal(null);
    expect(localStorage.get('key5', 'Default Value')).to.equal('Default Value');
    expect(localStorage.get('key6')).to.deep.equal({a: 'a', b: {c: {d: 0.75}}, e: {f: 'f'}});
    expect(localStorage.get('key6.b')).to.deep.equal({c: {d: 0.75}});
    expect(localStorage.get('key6.b.c')).to.deep.equal({d: 0.75});
    expect(localStorage.get('key6.b.c.d')).to.equal(0.75);
    expect(localStorage.get('key6.b.c.f', 'Default Value')).to.equal('Default Value');
  });

  it('getMultiple', () => {
    expect(localStorage.getMultiple(['key1', 'key2', 'key8'])).to.deep.equal({
      "key1": null,
      "key2": 2,
      "key8": null,
    });

    expect(localStorage.getMultiple(['key1', 'key2', 'key8'], 'Default Value')).to.deep.equal({
      "key1": null,
      "key2": 2,
      "key8": 'Default Value',
    });
  });

  it('setMultiple', () => {
    expect(localStorage.setMultiple({key7: 'Value 7', key8: 'Value 8'})).to.equal(true);
    expect(localStorage.get('key7')).to.equal('Value 7');
    expect(localStorage.get('key8')).to.equal('Value 8');
  })

  it('delete', () => {
    expect(localStorage.delete('key2')).to.equal(true);
    expect(localStorage.get('key2')).to.equal(null);

    expect(localStorage.delete('key6.e')).to.equal(true);
    expect(localStorage.get('key6')).to.deep.equal({a: 'a', b: {c: {d: 0.75}}});

    expect(localStorage.delete('key6.b.c')).to.equal(true);
    expect(localStorage.get('key6')).to.deep.equal({a: 'a', b: {}});
  });

  it('deleteMultiple', () => {
    expect(localStorage.setMultiple({key7: 'Value 7', key8: 'Value 8'})).to.equal(true);
    expect(localStorage.get('key7')).to.equal('Value 7');
    expect(localStorage.get('key8')).to.equal('Value 8');
    expect(localStorage.deleteMultiple(['key7', 'key8'])).to.equal(true);
    expect(localStorage.get('key7')).to.equal(null);
    expect(localStorage.get('key8')).to.equal(null);
  })

  it('length', () => {
    expect(localStorage.length()).to.equal(5);
  })

  it('clear', () => {
    expect(localStorage.clear()).to.equal(true);
    expect(localStorage.length()).to.equal(0);
  })

  it('index', () => {
    expect(localStorage.index(0)).to.equal(null);
    expect(localStorage.index(1)).to.equal(2);
    expect(localStorage.index(2)).to.equal('Value 3');
    expect(localStorage.index(3)).to.deep.equal(date);
    expect(localStorage.index(4)).to.deep.equal({a: 'a', b: {c: {d: 0.75}}, e: {f: 'f'}});
    expect(localStorage.index(5)).to.equal(null);
    expect(localStorage.index(5, 'Default Value')).to.equal('Default Value');
  })

  it('isEmpty', () => {
    expect(localStorage.isEmpty()).to.equal(false);
    expect(localStorage.clear()).to.equal(true);
    expect(localStorage.isEmpty()).to.equal(true);
  })

});
