// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

// eslint-disable-next-line no-global-assign
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  return newRequire;
})({"fRxd":[function(require,module,exports) {
window.dom = {

    //增
    create: function create(string) {
        /*
            1.输入create("<div><span>你好<span></div>")自动创建好div和span
            2.实现思路是把字符串写进InnerHTML
            3.用template，可以容纳所有标签
            4.比如div里不能直接放<tr></tr>
            5.template可以直接放
        */
        var container = document.createElement("template");
        container.innerHTML = string.trim(); //去掉多余空格，也可以写成String.prototype.trim.call(string);
        return container.content.firstChild;
    },
    after: function after(node, node2) {
        /*
            1.在node后面接上node2
            2.但DOM只提供了insertBefore接口（在接口前插入新接口）
            3.所以在1后面插入3，等于在2前面插入3
            4.也就是在node的下一节点前插入node2
            5.即使node已经是最后一个节点，即node.nextSibling取值为空也可以插入
         */
        node.parentNode.insertBefore(node2, node.nextSibling);
    },
    before: function before(node, node2) {
        node.parentNode.insertBefore(node2, node);
    },
    append: function append(parent, node) {
        //新加一个node节点作为子节点
        parent.appendChild(node);
    },
    wrap: function wrap(node, parent) {
        /*
            1.把新的父节点parent插入到node前
            2.再把node节点作为子节点合并到新的parent节点里
        */
        dom.before(node, parent);
        dom.append(parent, node);
    },


    //删
    remove: function remove(node) {
        node.parentNode.removeChild(node);
        return node;
    },
    empty: function empty(node) {
        /*删除后代
            1.新语法const {childNodes} = node等于const childNodes = node.childNodes
            2.childNodes长度在每次移除后代时会发生变化
            3.用下面移除方式时会同时移除文本节点（例如html里面的回车），所以返回时保证完整性要获取到文本节点
        */
        var array = [];
        var x = node.firstChild;
        while (x) {
            array.push(dom.remove(node.firstChild));
            x = node.firstChild;
        }
        return array;
    },


    //改
    attr: function attr(node, name, value) {
        /*
            1.重载：根据参数个数的写不同的代码
            2.三个参数时改，两个参数时查
        */
        if (arguments.length === 3) {
            node.setAttribute(name, value);
        } else if (arguments.length === 2) {
            return node.getAttribute(name, value);
        }
    },
    text: function text(node, string) {
        /*
            1.适配不同浏览器
            2.innerText => Ie
            3.textContent => Firefox
        */
        if (arguments.length === 2) {
            if ('innerText' in node) {
                node.innerText = string;
            } else {
                node.textContent = string;
            }
        } else if (arguments.length === 1) {
            if ('innerText' in node) {
                return node.innerText;
            } else {
                return node.textContent;
            }
        }
    },
    html: function html(node, string) {
        if (arguments.length === 2) {
            node.innerHTML = string;
        } else if (arguments.length === 1) {
            return node.innerHTML;
        }
    },
    style: function style(node, name, value) {
        /*  
            1.dom.style(div, 'color', 'red')
            2.dom.style(div, 'color')
            3.dom.style(div, {color: 'red'})
        */
        if (arguments.length === 3) {
            node.style[name] = value;
        } else if (arguments.length === 2) {
            if (typeof name === 'string') {
                return node.style[name];
            } else if (name instanceof Object) {
                var object = name;
                for (var key in object) {
                    node.style[key] = object[key];
                }
            }
        }
    },

    class: {
        //添加、删除和查看class
        add: function add(node, className) {
            node.classList.add(className);
        },
        remove: function remove(node, className) {
            node.classList.remove(className);
        },
        has: function has(node, className) {
            return node.classList.contains(className);
        }
    },
    on: function on(node, eventName, fn) {
        //添加事件
        node.addEventListener(eventName, fn);
    },
    off: function off(node, eventName, fn) {
        //删除事件
        node.removeEventListener(eventName, fn);
    },


    //查
    find: function find(selector, scope) {
        //dom.find('选择器',范围)用于获取标签
        return (scope || document).querySelectorAll(selector);
    },
    parent: function parent(node) {
        return node.parent;
    },
    children: function children(node) {
        return node.children;
    },
    siblings: function siblings(node) {
        /*
            1.获取兄弟姐妹元素
            2.将父元素中所有子元素的伪数组转换为真数组
            3.用filter过滤node来确定兄弟姐妹元素
        */
        return Array.from(node.parentNode.children).filter(function (n) {
            return n !== node;
        });
    },
    next: function next(node) {
        //获取弟弟
        var x = node.nextSibling;
        while (x && x.nodeType === 3) {
            x = x.nextSibling;
        }
        return x;
    },
    previous: function previous(node) {
        //获取哥哥
        var x = node.previousSibling;
        while (x && x.nodeType === 3) {
            x = x.previousSibling;
        }
        return x;
    },
    each: function each(nodeList, fn) {
        //用于遍历所有节点
        for (var i = 0; i < nodeList.length; i++) {
            fn.call(null, nodeList[i]);
        }
    },
    index: function index(node) {
        //获取排行第几，用数组下标显示
        var list = dom.children(node.parentNode);
        var i = 0;
        for (i; i < list.length; i++) {
            if (list[i] === node) {
                break;
            }
        }
        return i;
    }
};
},{}]},{},["fRxd"], null)
//# sourceMappingURL=dom.cc47c051.map