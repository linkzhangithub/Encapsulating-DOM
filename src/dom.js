window.dom = {
    

//增
    create(string) {
    /*
        1.输入create("<div><span>你好<span></div>")自动创建好div和span
        2.实现思路是把字符串写进InnerHTML
        3.用template，可以容纳所有标签
        4.比如div里不能直接放<tr></tr>
        5.template可以直接放
    */
        const container = document.createElement("template");
        container.innerHTML = string.trim();  //去掉多余空格，也可以写成String.prototype.trim.call(string);
        return container.content.firstChild;
    },
    after(node, node2) {
    /*
        1.在node后面接上node2
        2.但DOM只提供了insertBefore接口（在接口前插入新接口）
        3.所以在1后面插入3，等于在2前面插入3
        4.也就是在node的下一节点前插入node2
        5.即使node已经是最后一个节点，即node.nextSibling取值为空也可以插入
     */
        node.parentNode.insertBefore(node2, node.nextSibling);
    },
    before(node, node2){
        node.parentNode.insertBefore(node2, node);
    },
    append(parent, node){
    //新加一个node节点作为子节点
        parent.appendChild(node)
    },
    wrap(node, parent){
    /*
        1.把新的父节点parent插入到node前
        2.再把node节点作为子节点合并到新的parent节点里
    */
        dom.before(node, parent);
        dom.append(parent,node);
    },


//删
    remove(node){
        node.parentNode.removeChild(node)
        return node;
    },
    empty(node){
    /*删除后代
        1.新语法const {childNodes} = node等于const childNodes = node.childNodes
        2.childNodes长度在每次移除后代时会发生变化
        3.用下面移除方式时会同时移除文本节点（例如html里面的回车），所以返回时保证完整性要获取到文本节点
    */
        const array = []
        let x = node.firstChild
        while(x){
            array.push(dom.remove(node.firstChild))
            x = node.firstChild
        }
        return array
    },


//改
    attr(node, name, value){
    /*
        1.重载：根据参数个数的写不同的代码
        2.三个参数时改，两个参数时查
    */
        if(arguments.length === 3){
            node.setAttribute(name, value)
        }else if(arguments.length === 2){
            return node.getAttribute(name, value)
        }
    },
    text(node, string){
    /*
        1.适配不同浏览器
        2.innerText => Ie
        3.textContent => Firefox
    */
        if(arguments.length === 2){
            if('innerText' in node){
                node.innerText = string
            }else{
                node.textContent = string
            }
        }else if(arguments.length === 1){
            if('innerText' in node){
                return node.innerText
            }else{
                return node.textContent
            }
        }
    },
    html(node, string){
        if(arguments.length === 2){
            node.innerHTML = string
        }else if(arguments.length === 1){
            return node.innerHTML
        }
    },
    style(node, name, value){
    /*  
        1.dom.style(div, 'color', 'red')
        2.dom.style(div, 'color')
        3.dom.style(div, {color: 'red'})
    */
        if(arguments.length === 3){
            node.style[name] = value
        }else if(arguments.length === 2){
            if(typeof name === 'string'){
                return node.style[name]
            }else if(name instanceof Object){
                const object = name
                for(let key in object){
                    node.style[key] = object[key]
                }
            }
        } 
    },
    class: {
    //添加、删除和查看class
        add(node, className){
            node.classList.add(className)
        },
        remove(node, className){
            node.classList.remove(className)
        },
        has(node, className){
            return node.classList.contains(className)
        }
    },
    on(node, eventName, fn){
    //添加事件
        node.addEventListener(eventName, fn)
    },
    off(node, eventName, fn){
    //删除事件
        node.removeEventListener(eventName, fn)
    },


//查
    find(selector, scope){
    //dom.find('选择器',范围)用于获取标签
        return (scope || document).querySelectorAll(selector)
    },
    parent(node){
        return node.parentNode
    },
    children(node){
        return node.children
    },
    siblings(node){
    /*
        1.获取兄弟姐妹元素
        2.将父元素中所有子元素的伪数组转换为真数组
        3.用filter过滤node来确定兄弟姐妹元素
    */ 
        return Array.from(node.parentNode.children).filter(n=>n!==node)
    },
    next(node){
    //获取弟弟
        let x = node.nextSibling
        while(x && x.nodeType === 3){
            x = x.nextSibling
        }
        return x
    },
    previous(node){
    //获取哥哥
        let x = node.previousSibling
        while(x && x.nodeType === 3){
            x = x.previousSibling
        }
        return x
    },
    each(nodeList, fn){
    //用于遍历所有节点
        for(let i=0;i<nodeList.length;i++){
            fn.call(null, nodeList[i])
        }
    },
    index(node){
    //获取排行第几，用数组下标显示
        const list = dom.children(node.parentNode)
        let i = 0
        for(i;i<list.length;i++){
            if(list[i] === node){
                break
            }
        }
        return i
    }

};