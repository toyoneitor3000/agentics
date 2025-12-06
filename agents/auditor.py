"""
auditor.py
Evaluates the output of the router.py file based on Gate-1 criteria.
Uses python-dotenv to load API keys from .env file.
"""

import os
import re
from typing import Dict, Any, List
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Get API keys from environment
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY")


class Gate1Rule:
    """
    Gate-1 Rule: Validates that the generated React component meets quality criteria.
    
    Criteria:
    1. Contains a default export function
    2. Uses Tailwind CSS classes
    3. No external dependencies (imports)
    4. Includes dark mode support (class="dark")
    5. Valid JSX/React syntax
    6. Code only, no explanations
    """
    
    def __init__(self):
        self.criteria = {
            "has_default_export": False,
            "uses_tailwind": False,
            "no_external_deps": False,
            "has_dark_mode": False,
            "is_code_only": False,
            "valid_jsx": False
        }
    
    def evaluate(self, output: str) -> Dict[str, Any]:
        """
        Evaluate the output based on Gate-1 criteria.
        
        Args:
            output: The generated React component code
            
        Returns:
            Dictionary with evaluation results and score
        """
        if not output or not isinstance(output, str):
            return {
                "passed": False,
                "score": 0.0,
                "criteria": self.criteria,
                "errors": ["Output is empty or invalid"]
            }
        
        errors = []
        
        # 1. Check for default export function
        if re.search(r'export\s+default\s+function', output):
            self.criteria["has_default_export"] = True
        else:
            errors.append("Missing 'export default function'")
        
        # 2. Check for Tailwind CSS classes (className with typical Tailwind patterns)
        if re.search(r'className\s*=\s*["\'].*?(flex|grid|bg-|text-|p-|m-|w-|h-)', output):
            self.criteria["uses_tailwind"] = True
        else:
            errors.append("No Tailwind CSS classes detected")
        
        # 3. Check for no external dependencies (no import statements except React if needed)
        import_lines = re.findall(r'^import\s+.*?from\s+["\'].*?["\']', output, re.MULTILINE)
        # Allow only React imports or no imports at all
        external_imports = [imp for imp in import_lines if 'react' not in imp.lower()]
        if len(external_imports) == 0:
            self.criteria["no_external_deps"] = True
        else:
            errors.append(f"Found external dependencies: {external_imports}")
        
        # 4. Check for dark mode support
        if 'dark:' in output or 'class="dark"' in output or "class='dark'" in output:
            self.criteria["has_dark_mode"] = True
        else:
            errors.append("No dark mode support detected")
        
        # 5. Check if it's code only (no markdown, no explanations)
        # Look for common explanation patterns
        explanation_patterns = [
            r'here\s+is',
            r'this\s+component',
            r'i\s+created',
            r'the\s+code\s+above',
            r'explanation:',
            r'note:',
            r'```'  # Markdown code blocks
        ]
        has_explanations = any(re.search(pattern, output, re.IGNORECASE) for pattern in explanation_patterns)
        if not has_explanations:
            self.criteria["is_code_only"] = True
        else:
            errors.append("Output contains explanations or markdown")
        
        # 6. Basic JSX validation (check for return statement and JSX structure)
        if re.search(r'return\s*\(?\s*<', output) and '</' in output:
            self.criteria["valid_jsx"] = True
        else:
            errors.append("Invalid or missing JSX structure")
        
        # Calculate score
        passed_criteria = sum(1 for v in self.criteria.values() if v)
        total_criteria = len(self.criteria)
        score = passed_criteria / total_criteria
        
        # Pass if score >= 0.8 (at least 5 out of 6 criteria)
        passed = score >= 0.8
        
        return {
            "passed": passed,
            "score": score,
            "criteria": self.criteria.copy(),
            "errors": errors,
            "total_criteria": total_criteria,
            "passed_criteria": passed_criteria
        }


def evaluate_output(output: str) -> Dict[str, Any]:
    """
    Main evaluation function that uses Gate-1 rule.
    
    Args:
        output: The generated React component code
        
    Returns:
        Dictionary with evaluation results
    """
    gate_1_rule = Gate1Rule()
    result = gate_1_rule.evaluate(output)
    
    return result


def print_evaluation_report(result: Dict[str, Any]) -> None:
    """
    Print a formatted evaluation report.
    
    Args:
        result: The evaluation result dictionary
    """
    print("\n" + "="*60)
    print("GATE-1 EVALUATION REPORT")
    print("="*60)
    print(f"\nStatus: {'✅ PASSED' if result['passed'] else '❌ FAILED'}")
    print(f"Score: {result['score']:.1%} ({result['passed_criteria']}/{result['total_criteria']})")
    
    print("\nCriteria:")
    for criterion, passed in result['criteria'].items():
        status = "✅" if passed else "❌"
        print(f"  {status} {criterion.replace('_', ' ').title()}")
    
    if result['errors']:
        print("\nErrors:")
        for error in result['errors']:
            print(f"  • {error}")
    
    print("="*60 + "\n")


# Example usage
if __name__ == "__main__":
    # Test with a sample output
    sample_output = """
export default function Component() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Hello World
        </h1>
      </div>
    </div>
  );
}
"""
    
    result = evaluate_output(sample_output)
    print_evaluation_report(result)
