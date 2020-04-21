var ASTNodeType = require('./Parser').ASTNodeType;

//保存变量
var variables = {}

function Script(){
    function evaluate(node, indent){
        let result = null;
        switch(node.getType()){
            case ASTNodeType.Program:
                for (const child of node.getChildren()) {
                    result = evaluate(child,indent);
                }
                break;
            case ASTNodeType.Additive:
                let child1 = node.getChildren()[0];
                let value1 = evaluate(child1, indent + "\t");
                let child2 = node.getChildren()[1];
                let value2 = evaluate(child2, indent + "\t");
                if (node.getText() == "+") {
                    result = value1 + value2;
                } else {
                    result = value1 - value2;
                }
                break;
            case ASTNodeType.Multiplicative:
                child1 = node.getChildren()[0];
                value1 = evaluate(child1, indent + "\t");
                child2 = node.getChildren()[1];
                value2 = evaluate(child2, indent + "\t");
                if (node.getText() == "*") {
                    result = value1 * value2;
                } else {
                    result = value1 / value2;
                }
                break;
            case ASTNodeType.IntLiteral:
                result = parseInt(node.getText());
                break;
            case ASTNodeType.Identifier:
                var varName = node.getText();
                if (variables[varName]) {
                    let value = variables[varName];
                    if (value != null) {
                        result = parseInt(value);
                    } else {
                        console.error("variable " + varName + " has not been set any value");
                    }
                }
                else{
                    console.error("unknown variable: " + varName);
                }
                break;
            case ASTNodeType.AssignmentStmt:
                varName = node.getText();
                if (!variables[varName]){
                    console.error("unknown variable: " + varName);
                }   //接着执行下面的代码
            case ASTNodeType.IntDeclaration:
                varName = node.getText();
                let varValue = null;
                if (node.getChildren().length > 0) {
                    let child = node.getChildren()[0];
                    result = evaluate(child, indent + "\t");
                    varValue = parseInt(result);
                }
                variables[varName] = varValue;
                break;
            default:
        }
        if (indent == "") {
            
        }
        return result;
    }
    return {
        evalfunc:evaluate
    }
}

exports.script = Script