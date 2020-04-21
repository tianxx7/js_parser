function Lexer(){
    var tokens = [];
    var tokenText = "";
    var token = null;
    function isAlpha(ch){
        return ch >= 'a' && ch <= 'z' || ch >= 'A' && ch <= 'Z';
    }
    function isBlank(ch){
        return ch == ' ' || ch == '\t' || ch == '\n';
    }
    function isDigit(ch){
        return ch >= '0' && ch <= '9';
    }

    function initToken(ch){
        if (tokenText.length > 0) {
            token.text = tokenText;
            tokens.push(token);
            tokenText = "";
            token = new SimpleToken();

        }
        let newState = DfaState.Initial;
        if (isAlpha(ch)) {
            if (ch == 'v') {
                newState = DfaState.Id_var1;
            } else {
                newState = DfaState.Id;
            }
            token.type = TokenType.Identifier;
            tokenText += ch;
        } else if (isDigit(ch)) {
            newState = DfaState.IntLiteral;
            token.type = TokenType.IntLiteral;
            tokenText += ch;
        } else if (ch == '>'){
            newState = DfaState.GT;
            token.type = TokenType.GT;
            tokenText += ch;
        } else if (ch == '+') {
            newState = DfaState.Plus;
            token.type = TokenType.Plus;
            tokenText += ch;
        } else if (ch == '-') {
            newState = DfaState.Minus;
            token.type = TokenType.Minus;
            tokenText += ch;
        } else if (ch == '*') {
            newState = DfaState.Star;
            token.type = TokenType.Star;
            tokenText += ch;
        } else if (ch == '/') {
            newState = DfaState.Slash;
            token.type = TokenType.Slash;
            tokenText += ch;
        } else if (ch == ';') {
            newState = DfaState.SemiColon;
            token.type = TokenType.SemiColon;
            tokenText += ch;
        } else if (ch == '(') {
            newState = DfaState.LeftParen;
            token.type = TokenType.LeftParen;
            tokenText += ch;
        } else if (ch == ')') {
            newState = DfaState.RightParen;
            token.type = TokenType.RightParen;
            tokenText += ch;
        } else if (ch == '=') {
            newState = DfaState.Assignment;
            token.type = TokenType.Assignment;
            tokenText += ch;
        } else  {
            newState = DfaState.Initial;
        }
        return newState;
    }

    //将代码进行词法分析
    function tokenizeFun(code) {
        tokens = [];
        tokenText = "";
        
        token = new SimpleToken();
        let ch = 0;
        let state = DfaState.Initial;
        for (let i = 0; i < code.length; i++) {
            ch = code.charAt(i);
            switch (state){
                case DfaState.Initial:
                    state = initToken(ch);
                    break;
                case DfaState.Id:
                    if (isAlpha(ch) || isDigit(ch)) {
                        tokenText += ch;
                    } else {
                        state = initToken(ch);
                    }
                    break;
                case DfaState.GT:
                    if (ch == '=') {
                        token.type = TokenType.GE;
                        state = DfaState.GE;
                        tokenText += ch;
                    } else {
                        state = initToken(ch);
                    }
                    break;
                case DfaState.GE:
                case DfaState.Assignment:
                case DfaState.Plus:
                case DfaState.Minus:
                case DfaState.Star:
                case DfaState.Slash:
                case DfaState.SemiColon:
                case DfaState.LeftParen:
                case DfaState.RightParen:
                    state = initToken(ch);
                    break;
                case DfaState.IntLiteral:
                    if (isDigit(ch)) {
                        tokenText += ch;
                    } else {
                        state = initToken(ch);
                    }
                    break;
                case DfaState.Id_var1:
                    if (ch == 'a') {
                        state = DfaState.Id_var2;
                        tokenText += ch;
                    } else if (isDigit(ch)) {
                        state = DfaState.Id;
                        tokenText += ch;
                    } else {
                        state = initToken(ch);
                    }
                    break;
                case DfaState.Id_var2:
                    if (ch == 'r') {
                        state = DfaState.Id_var3;
                        tokenText += ch;
                    } else if (isDigit(ch) || isAlpha(ch)){
                        state = DfaState.Id;    //切换回id状态
                        tokenText += ch;
                    } else {
                        state = initToken(ch);
                    }
                    break;
                case DfaState.Id_var3:
                    if (isBlank(ch)) {
                        token.type = TokenType.Var;
                        state = initToken(ch)
                    } else {
                        state = DfaState.Id;
                        tokenText += ch;
                    }
                    break
                default:
            }
        }
        if (tokenText.length > 0) {
            initToken(ch);
        }
        return new SimpleTokenReader(tokens);
    }

    return {
        tokenize:tokenizeFun
    }
}
var DfaState = {
    "Initial":1,
    "If":2,
    "Id_if1":3,
    "Id_if2":4,
    "Else":5,
    "Id_else1":6,
    "Id_else2":7,
    "Id_else3":8,
    "Id_else4":9,
    "Id_var1":10,
    "Id_var2":11,
    "Id_var3":12,
    "Id":13,
    "Var":14,
    "GT":15,
    "GE":16,
    "Assignment":17,
    "Plus":18,
    "Minus":19,
    "Star":20,
    "Slash":21,
    "SemiColon":22,
    "LeftParen":23,
    "RightParen":24,
    "IntLiteral":25
};

var TokenType={
    'Plus':1,
    'Minus':2,
    'Star':3,
    'Slash':4,
    'GE':5,
    'GT':6,
    'EQ':7,
    'LE':8,
    'LT':9,
    'SemiColon':10,
    'LeftParen':11,
    'RightParen':12,
    'Assignment':13,
    'If':14,
    'Else':15,
    'Var':16,
    'Identifier':17,
    'IntLiteral':18,
    'StringLiteral':19
}

function SimpleTokenReader(tokens){
    return {
        tokens : tokens,
        pos : 0,
        getPosition:function(){
            return this.pos;
        },
        setPosition: function(pos){
            this.pos = pos;
        },
        read:function(){
            if (this.pos <this.tokens.length) {
                return this.tokens[this.pos++];
            }
            return null;
        },
        peek:function(){
            if (this.pos < this.tokens.length) {
                return this.tokens[this.pos];
            }
            return null;
        },
        unread:function(){
            if (this.pos > 0) {
                this.pos--;
            }
        }
    };
}
function SimpleToken(){
    return {
        type:"", // token类型
        text:"", // token文本值
        getType:function(){
            return this.type;
        },
        getText:function(){
            return this.text;
        }
    }
}

exports.lexer = Lexer
exports.tokenType = TokenType
