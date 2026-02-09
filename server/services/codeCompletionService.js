import HuggingFaceService from './huggingfaceService.js';
 
/**
 * Code Completion Service
 * Handles code suggestion and analysis using AI models
 * Integrates with Hugging Face code generation models
 */

const CodeCompletionService = {
  /**
   * Get code completion suggestions
   * @param {string} code - Incomplete code snippet
   * @param {number} numSuggestions - Number of suggestions to return
   * @param {number} temperature - Sampling temperature (0-1)
   * @returns {Promise<string[]>} Array of code suggestions
   */
  async getCompletions(code, numSuggestions = 5, temperature = 0.7) {
    try {
      const model = process.env.CODE_COMPLETION_MODEL || 'Salesforce/codegen-350M-mono';

      // Call Hugging Face code generation pipeline
      const suggestions = await HuggingFaceService.generateCode(
        code,
        {
          max_length: 150,
          num_return_sequences: numSuggestions,
          temperature,
          top_p: 0.95,
        },
        model
      );

      return suggestions;
    } catch (error) {
      console.error('Error in getCompletions:', error);
      throw new Error(`Code completion error: ${error.message}`);
    }
  },

  /**
   * Validate code syntax
   * @param {string} code - Code to validate
   * @returns {Promise<{valid: boolean, errors: string[]}>} Validation results
   */
  async validateCode(code) {
    try {
      const errors = [];

      // Basic syntax checks
      const syntaxCheck = performSyntaxCheck(code);
      if (!syntaxCheck.valid) {
        errors.push(...syntaxCheck.errors);
      }

      return {
        valid: errors.length === 0,
        errors,
        codeLength: code.length,
      };
    } catch (error) {
      console.error('Error in validateCode:', error);
      throw new Error(`Validation error: ${error.message}`);
    }
  },

  /**
   * Explain code functionality
   * @param {string} code - Code snippet to explain
   * @returns {Promise<string>} Code explanation
   */
  async explainCode(code) {
    try {
      // Use text generation model to create explanation
      const explanation = await HuggingFaceService.generateText(
        `Explain this code in simple terms:\n${code}\n\nExplanation:`,
        {
          max_length: 200,
        }
      );

      return explanation;
    } catch (error) {
      console.error('Error in explainCode:', error);
      throw new Error(`Explanation error: ${error.message}`);
    }
  },
};

/**
 * Performs basic syntax checks on code
 * @param {string} code - Code to check
 * @returns {object} Syntax check results
 */
function performSyntaxCheck(code) {
  const errors = [];

  // Check for common syntax issues
  const bracketBalance = code.match(/\{/g)?.length === code.match(/\}/g)?.length;
  if (!bracketBalance) {
    errors.push('Unbalanced braces detected');
  }

  const parenBalance = code.match(/\(/g)?.length === code.match(/\)/g)?.length;
  if (!parenBalance) {
    errors.push('Unbalanced parentheses detected');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

export default CodeCompletionService;
