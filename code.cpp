// Header Files
#include <iostream>
#include <cmath>
#include <stack>
#include <sstream>
#include <algorithm>
#include <vector>
using namespace std;

// Base class
class BasicCalculator
{
protected:
    double num1, num2;

public:
    BasicCalculator(double a = 0, double b = 0) : num1(a), num2(b) {}
    virtual ~BasicCalculator() { cout << "BasicCalculator Destructor Called" << endl; }

    // Constructor
    void setValues(double a, double b)
    {
        num1 = a;
        num2 = b;
    }

    // Basic Arithmetic Calculations
    double add() { return num1 + num2; }
    double subtract() { return num1 - num2; }
    double multiply() { return num1 * num2; }
    double divide() { return (num2 != 0) ? num1 / num2 : 0; }

    virtual void display()
    {
        cout << "Basic Calculator Operations" << endl;
    }
};

// Derived class for Scientific Calculator
class ScientificCalculator : public BasicCalculator
{
public:
    ScientificCalculator(double a = 0, double b = 0) : BasicCalculator(a, b) {}
    ~ScientificCalculator() { cout << "ScientificCalculator Destructor Called" << endl; }

    // Precedence function
    int precedence(char op) {
        if (op == '^') return 3;
        if (op == '*' || op == '/') return 2;
        if (op == '+' || op == '-') return 1;
        return 0;
    }

    // Infix to Postfix Conversion 
    string infixToPostfix(string infix)
    {
        stack<char> s;
        string postfix = "";
        stringstream ss(infix);
        string token;

        while (ss >> token)
        {
            if (isdigit(token[0]) || (token.length() > 1 && token[0] == '-'))
            { // Handle multi-digit and negative numbers
                postfix += token + " ";
            }
            else if (token == "(")
            {
                s.push('(');
            }
            else if (token == ")")
            {
                while (!s.empty() && s.top() != '(')
                {
                    postfix += s.top();
                    postfix += " ";
                    s.pop();
                }
                s.pop(); // Remove the opening parenthesis
            }
            else
            { // Operator case
                while (!s.empty() && precedence(s.top()) >= precedence(token[0]))
                {
                    postfix += s.top();
                    postfix += " ";
                    s.pop();
                }
                s.push(token[0]);
            }
        }

        // Pop remaining operators from the stack
        while (!s.empty())
        {
            postfix += s.top();
            postfix += " ";
            s.pop();
        }

        return postfix;
    }

    // Infix to Prefix Conversion
    string infixToPrefix(string infix)
    {
        reverse(infix.begin(), infix.end());
        for (char &c : infix)
        {
            if (c == '(')
                c = ')';
            else if (c == ')')
                c = '(';
        }
        string postfix = infixToPostfix(infix);
        reverse(postfix.begin(), postfix.end());
        return postfix;
    }

    // Evaluate Postfix Expression
     double evaluatePostfix(string expression) {
        stack<double> s;
        stringstream ss(expression);
        string token;

        while (ss >> token) {
            if (isdigit(token[0]) || (token.length() > 1 && token[0] == '-')) {
                s.push(stod(token));
            } else {
                double b = s.top(); s.pop();
                double a = s.top(); s.pop();

                if (token == "+") s.push(a + b);
                else if (token == "-") s.push(a - b);
                else if (token == "*") s.push(a * b);
                else if (token == "/") s.push(a / b);
                else if (token == "^") s.push(pow(a, b));
            }
        }

        return s.top();
    }

    // Evaluate Prefix Expression
    double evaluatePrefix(string expression) {
        stack<double> s;
        vector<string> tokens;
        stringstream ss(expression);
        string token;

        while (ss >> token) tokens.push_back(token);

        for (int i = tokens.size() - 1; i >= 0; i--) {
            token = tokens[i];
            if (isdigit(token[0]) || (token.length() > 1 && token[0] == '-')) {
                s.push(stod(token));
            } else {
                double a = s.top(); s.pop();
                double b = s.top(); s.pop(); 
                if (token == "+") s.push(a + b);
                else if (token == "-") s.push(a - b);
                else if (token == "*") s.push(a * b);
                else if (token == "/") s.push(a / b);
                else if (token == "^") s.push(pow(a, b));
            }
        }

        return s.top();
    }

    // Evaluate Infix Expression
    double evaluateInfix(string infix) {
        string postfix = infixToPostfix(infix);
        return evaluatePostfix(postfix);
    }

    // Function Overloading
    double power(double base, double exp) { return pow(base, exp); }
    double power(int base, int exp) { return pow(base, exp); }

    double squareRoot(double num) { return sqrt(num); }
    double logarithm(double num) { return log(num); }
    double sine(double angle) { return sin(angle); }
    double cosine(double angle) { return cos(angle); }
    double tangent(double angle) { return tan(angle); }

    // Function Overriding
    void display() override
    {
        cout << "Scientific Calculator Operations" << endl;
    }


    // Temperature Conversions
    double celsiusToFahrenheit(double c) { return (c * 9 / 5) + 32; }
    double fahrenheitToCelsius(double f) { return (f - 32) * 5 / 9; }
    double celsiusToKelvin(double c) { return c + 273.15; }
    double kelvinToCelsius(double k) { return k - 273.15; }
};

// Main Function
int main()
{
    ScientificCalculator calc;
    int choice;
    double a, b;
    string expression;

    // While loop to choose options
    do
    {
        cout << "\nScientific Calculator";
        cout << "\n1. Add";
        cout << "\n2. Subtract";
        cout << "\n3. Multiply";
        cout << "\n4. Divide";
        cout << "\n5. Power";
        cout << "\n6. Square Root";
        cout << "\n7. Logarithm";
        cout << "\n8. Sine";
        cout << "\n9. Cosine";
        cout << "\n10. Tangent";
        cout << "\n11. Evaluate Postfix Expression";
        cout << "\n12. Evaluate Prefix Expression";
        cout << "\n13. Evaluate Infix Expression";
        cout << "\n14. Celsius to Fahrenheit";
        cout << "\n15. Fahrenheit to Celsius";
        cout << "\n16. Celsius to Kelvin";
        cout << "\n17. Kelvin to Celsius";
        cout << "\n18. Exit";
        cout << "\nEnter your choice: ";
        cin >> choice;

        switch (choice)
        {
        case 1:
        case 2:
        case 3:
        case 4:
            cout << "Enter two numbers: ";
            cin >> a >> b;
            calc.setValues(a, b);
            if (choice == 1)
                cout << "Result: " << calc.add() << endl;
            else if (choice == 2)
                cout << "Result: " << calc.subtract() << endl;
            else if (choice == 3)
                cout << "Result: " << calc.multiply() << endl;
            else
                cout << "Result: " << calc.divide() << endl;
            break;
        case 5:
            cout << "Enter base and exponent: ";
            cin >> a >> b;
            cout << "Result: " << calc.power(a, b) << endl;
            break;
        case 6:
            cout << "Enter number: ";
            cin >> a;
            cout << "Result: " << calc.squareRoot(a) << endl;
            break;
        case 7:
            cout << "Enter number: ";
            cin >> a;
            cout << "Result: " << calc.logarithm(a) << endl;
            break;
        case 8:
            cout << "Enter angle in radians: ";
            cin >> a;
            cout << "Result: " << calc.sine(a) << endl;
            break;
        case 9:
            cout << "Enter angle in radians: ";
            cin >> a;
            cout << "Result: " << calc.cosine(a) << endl;
            break;
        case 10:
            cout << "Enter angle in radians: ";
            cin >> a;
            cout << "Result: " << calc.tangent(a) << endl;
            break;
        case 11:
            cout << "Enter postfix expression (e.g., '5 3 + 2 *'): ";
            cin.ignore();
            getline(cin, expression);
            cout << "Result: " << calc.evaluatePostfix(expression) << endl;
            break;
        case 12:
            cout << "Enter prefix expression: ";
            cin.ignore();
            getline(cin, expression);
            cout << "Result: " << calc.evaluatePrefix(expression) << endl;
            break;
        case 13:
            cout << "Enter infix expression: ";
            cin.ignore();
            getline(cin, expression);
            cout << "Result: " << calc.evaluateInfix(expression) << endl;
            break;
        case 14:
            cout << "Enter Celsius temperature: ";
            cin >> a;
            cout << "Result: " << calc.celsiusToFahrenheit(a) << " °F" << endl;
            break;
        case 15:
            cout << "Enter Fahrenheit temperature: ";
            cin >> a;
            cout << "Result: " << calc.fahrenheitToCelsius(a) << " °C" << endl;
            break;
        case 16:
            cout << "Enter Celsius temperature: ";
            cin >> a;
            cout << "Result: " << calc.celsiusToKelvin(a) << " K" << endl;
            break;
        case 17:
            cout << "Enter Kelvin temperature: ";
            cin >> a;
            cout << "Result: " << calc.kelvinToCelsius(a) << " °C" << endl;
            break;
        case 18:
            cout << "Exiting..." << endl;
            break;
        default:
            cout << "Invalid choice! Try again." << endl;
        }
    } while (choice != 18);

    // Returning the value
    return 0;
}
