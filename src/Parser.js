// 语法分析
//引入词法分析器
var Lexer = require('./Lexer').lexer;
//引入词法的枚举类型
var TokenType = require('./Lexer').tokenType;

//返回一个ASTnode
function Parser(){
    function parse(script){
        var lexer = Lexer();
        let tokens = lexer.tokenize(script);
        let rootNode = prog(tokens)
        return rootNode;
    }
    function prog(tokens){
        let node = new SimpleASTNode(ASTNodeType.Program,'pwc');
        while(tokens.peek() != null) {
            //变量声明
            let child = varDeclare(tokens);
            if (child == null) {
                child = expressionStatement(tokens);
            }
            if (child == null) {
                child = assignmentStatement(tokens);
            }
            if (child != null) {
                node.addChild(child)
            } else {
                console.error("unknown statement")
                return;
            }
        }
        return node;
    }

    function varDeclare(tokens){
        let node = null;
        let token = tokens.peek();
        if (token != null && token.getType() == TokenType.Var) { // 是整型声明
            token = tokens.read();// int
            if (tokens.peek().getType() == TokenType.Identifier) { // 是标识符  age
                token = tokens.read(); // age
                node = new SimpleASTNode(ASTNodeType.IntDeclaration, token.getText());
                token = tokens.peek();
                if (token != null && token.getType() == TokenType.Assignment) {
                    tokens.read();  // =
                    let child = additive(tokens);
                    if (child == null) {
                        console.error("invalide variable initialization, expecting an expression");
                    } else {
                        node.addChild(child);
                    }
                }
            } else {
                console.log("变量名异常");
            }
            if (node != null) {
                token = tokens.peek();
                if (token != null && token.getType() == TokenType.SemiColon) {
                    tokens.read();
                } else {
                    console.error("invalid statement, expecting semicolon");
                }
            }
        }
        return node;
    }

    function assignmentStatement(tokens) {
        let node = null;
        let token = tokens.peek();
        if (token != null && token.getType() == TokenType.Identifier) {
            token = tokens.read();
            node = new SimpleASTNode(ASTNodeType.AssignmentStmt,token.getText());
            token = tokens.peek();
            if (token != null && token.getType() == TokenType.Assignment) {
                tokens.read();
                let child = additive(tokens);
                if (null == child) {
                    console.error("invalide assignment statement");
                } else {
                    node.addChild(child);
                    token = tokens.peek();
                    if (token != null && token.getType() == TokenType.SemiColon) {
                        tokens.read();
                    } else {
                        console.error("invalid statement, expecting semicolon");
                    }
                }
            } else {
                tokens.unread();
                node = null;
            }
        }
        return node;
    }

    function primary(tokens){
        let node = null;
        let token = tokens.peek();
        if (token != null) {
            if (token.getType() == TokenType.IntLiteral) { // 是字面量
                token = tokens.read();
                node = new SimpleASTNode(ASTNodeType.IntLiteral, token.getText());
            } else if (token.getType() == TokenType.Identifier) { // 是标识符
                token = tokens.read();
                node = new SimpleASTNode(ASTNodeType.Identifier, token.getText());
            } else if (token.getType() == TokenType.LeftParen) {
                tokens.read();
                node = additive(tokens);
                if (node != null) {
                    token = tokens.peek();
                    if (token != null && token.getType() == TokenType.RightParen) {
                        tokens.read();
                    } else {
                        console.error("缺失右括号");
                    }
                } else {
                    console.error("期望括号内的累加表达式");
                }
            }
        }
        return node;
    }

    function multiplicative(tokens){
        let child1 = primary(tokens);
        let node = child1;
        while (true) {
            let token = tokens.peek();// 是 * 或 /
            if (token != null && (token.getType() == TokenType.Star || token.getType() == TokenType.Slash)) {
                token = tokens.read();
                let child2 = primary(tokens);
                if (child2 != null) {
                    node = new SimpleASTNode(ASTNodeType.Multiplicative, token.getText());
                    node.addChild(child1);
                    node.addChild(child2);
                    child1 = node;
                } else {
                    console.error("invalid multiplicative expression, expecting the right part.");
                }
            } else {
                break;
            }
        }
        return node;
    }

    
    function additive(tokens){
        let child1 = multiplicative(tokens);//应用add规则
        let node = child1;
        if (child1 != null) {
            while (true) {
                let token = tokens.peek();
                if (token != null && (token.getType() == TokenType.Plus || token.getType() == TokenType.Minus)) {
                    token = tokens.read();              //读出加号
                    let child2 = multiplicative(tokens);  //计算下级节点
                    if (child2 != null) {
                        node = new SimpleASTNode(ASTNodeType.Additive, token.getText());
                        node.addChild(child1);              //注意，新节点在顶层，保证正确的结合性
                        node.addChild(child2);
                        child1 = node;
                    } else {
                        console.log("invalid additive expression, expecting the right part.");
                    }
                } else {
                    break;
                }
            }
        }
        return node;
    }


    function expressionStatement(tokens){
        let pos = tokens.getPosition();
        let node  = additive(tokens);
        if (null != node) {
            let token = tokens.peek();
            if (token != null && token.getType() == TokenType.SemiColon) {
                tokens.read();
            } else {
                node = null;
                tokens.setPosition(pos);
            }
        }
        return node;
    }

    return {
        parse:parse
    }
}

var ASTNodeType = {
    'Program':1,
    'IntDeclaration':2,
    'ExpressionStmt':3,
    'AssignmentStmt':4,
    'Primary':5,
    'Multiplicative':6,
    'Additive':7,
    'Identifier':8,
    'IntLiteral':9
}

function SimpleASTNode(nodeType,text){
    return {
        parent : null,
        children : [],
        readonlychildren : [],
        nodeType:nodeType,
        text : text,
        getParent : function(){return this.parent},
        getChildren : function(){return this.children},
        getType : function(){return this.nodeType},
        getText : function(){return this.text},
        addChild : function(child){this.children.push(child);child.parent = this}
    }
}

exports.parser = Parser;
exports.ASTNodeType = ASTNodeType