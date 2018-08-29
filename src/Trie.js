/**
 * constructor of Trie
 * @constructor
 */
export default function Trie() {
  this._root = new TrieNode('');
}

/**
 * get end TrieNode by word
 * @param {string} word word to search Trie with.
 * @return {TrieNode|undefined} the end TrieNode
 */
Trie.prototype.getEndTrieNode = function(word) {
  let currentNode = this._root;

  for (let i=0; i<word.length; i++) {
    let key = word[i];
    currentNode = currentNode._children[key];

    // if didn't find end TrieNode in Trie, return undefined
    if (currentNode === undefined) break;
  }
  return currentNode;
};

/**
 * insert word to Trie
 * @param {string} word The word that you want to add to Trie
 * @param {*} value value that will store at the end TrieNode
 */
Trie.prototype.insert = function(word, value) {
  // throw error when word is not a string
  if (typeof word !== 'string') {
    throw new Error('Trie: Insert non string object in Trie.');
  }

  word = word.toLowerCase();

  // record current node
  let currentNode = this._root;

  for (let i=0; i<word.length; i++) {
    let key = word[i];

    // if TrieNode hasn't been created yet, create it
    if (!currentNode._children.hasOwnProperty(key)) {
      currentNode._children[key] = new TrieNode(key);
    }

    currentNode = currentNode._children[key];
  }
  currentNode._value.push(value);
};

/**
 * find _value with word in Trie
 * @param {string} word The word that you want to search in Trie
 * @return {array} _value array of the end TrieNode
 */
Trie.prototype.find = function(word) {
  if (typeof word !== 'string') {
    throw new Error('Trie: Find non string object in Trie.');
  }

  word = word.toLowerCase();

  let endTrieNode = this.getEndTrieNode(word);

  if (endTrieNode === undefined) return undefined;
  else return endTrieNode._value;
};

/**
 * find whether word exist in Trie
 * @param {string} word The word that you want to search in Trie
 * @return {bool} whether the word is in Trie
 */
Trie.prototype.contains = function(word) {
  if (typeof word !== 'string') {
    throw new Error('Trie: Find non string object in Trie.');
  }
  word = word.toLowerCase();

  let endTrieNode = this.getEndTrieNode(word);
  if (endTrieNode === undefined) return false;
  else return (endTrieNode._value.length !== 0);
};

/**
 * constructor of TrieNode
 * @constructor
 * @param {string} key the char this trieNode represent
 */
function TrieNode(key) {
  this._key = key;
  this._children = {};
  this._value = [];
}
