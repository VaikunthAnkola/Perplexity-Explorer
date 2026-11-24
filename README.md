# Perplexity Explorer 2.0 🔮

**Perplexity Explorer 2.0** is an interactive, modern educational web application designed to help students and developers understand how autoregressive language models predict tokens, compute conditional probability distributions via softmax, and derive sequence perplexity scores.

Built with **React 18**, **TypeScript**, **Tailwind CSS**, **Framer Motion**, and **Hugging Face Transformers.js (DistilGPT-2)**.

---

## 🚀 Key Features

### 1. Token Explorer
- **Live Causal LM Inference**: Tokenizes sentences and aligns each token's prediction with its preceding context using DistilGPT-2 (`Xenova/distilgpt2`).
- **Token Visualization**: Visual cards displaying token index, probability, negative log-likelihood ($-\ln P$), and vocabulary rank.
- **Color Coded Tiers**:
  - 🟢 **Green**: High probability ($P \ge 35\%$)
  - 🟡 **Yellow**: Medium probability ($8\% \le P < 35\%$)
  - 🔴 **Red**: Low probability ($P < 8\%$)
- **Interactive Token Inspector**: Click any token card to open a modal detailing:
  - Exact preceding context slice
  - Softmax distribution over top candidate tokens
  - Token rank in vocabulary (~50,257 tokens)
  - Information surprisal measured in bits ($-\log_2 P$)
- **Animated Circular Gauge**: Prominent visual indicator of sequence perplexity with effective branching factor interpretation.
- **Step-by-Step Derivation**: Full mathematical breakdown panel showing the exact calculation from negative log-likelihoods to exponentiated loss.

### 2. Probability Laboratory (Model-Free Sandbox)
- Completely standalone sandbox that requires **zero model downloads**.
- Add, edit, remove tokens dynamically.
- Live sliders and numeric inputs for individual probabilities ($0 < P \le 1$).
- Real-time validation error alerts.
- **Curated Educational Presets**:
  - **Preset A (Uniform 0.125)**: Expected Perplexity = $8.000$
  - **Preset B (High Confidence)**: $0.90, 0.95, 0.85$ &rarr; Low Perplexity (~$1.116$)
  - **Preset C (Low Confidence)**: $0.10, 0.15, 0.08$ &rarr; High Perplexity (~$9.4$)
  - **Preset D (Mixed Probabilities)**: $0.50, 0.80, 0.20$ &rarr; Intermediate Perplexity (~$4.31$)

### 3. Sentence Comparison
- Side-by-side evaluation of Sentence A vs. Sentence B using the identical model and tokenization settings.
- Displays surprise ratio, token distributions, cross-entropy loss, and qualitative pedagogical explanations.
- Highlights the golden scientific rule: *Perplexity comparisons are only valid when evaluated on the exact same model and tokenizer*.

### 4. Learning Center
- Beginner-friendly explanations of core concepts:
  - What is a Language Model?
  - What is a Token & Tokenization? (includes live interactive tokenizer sandbox)
  - Probability vs. Conditional Probability
  - How GPT predicts next tokens via Transformer layers, Logits, and Softmax
  - What is Perplexity? (Branching factor intuition and mathematical formulation)
- Interactive knowledge check quiz.

### 5. Calculation History
- Saves evaluations locally in browser `localStorage`.
- Zero external server telemetry or data storage (100% private).
- Quick reload action to load any historical sentence back into Token Explorer.

### 6. Design & Customization
- **AI-Inspired Dark Theme** with glassmorphism cards, glowing borders, and purple/cyan gradients.
- **Functional Dark / Light Theme Switcher**.
- **Model Engine Toggle**: Switch seamlessly between in-browser **Transformers.js DistilGPT-2 (ONNX)** and the **Fast Simulation Engine**.

---

## 🧮 Mathematical Formulation

$$\text{Perplexity} = \exp\left(-\frac{1}{N} \sum_{i=1}^N \ln P(t_i \mid t_1, \dots, t_{i-1})\right) = \left(\prod_{i=1}^N \frac{1}{P(t_i \mid t_1, \dots, t_{i-1})}\right)^{1/N}$$

Where:
- $N$ is the number of conditionally evaluated tokens (excluding prompt seed token $0$).
- $P(t_i \mid t_1, \dots, t_{i-1})$ is the probability assigned to the actual observed token given prior context.
- Log probabilities are calculated stably via:
  $$\log(\text{softmax}(z)_k) = (z_k - \max(z)) - \ln\left(\sum_j \exp(z_j - \max(z))\right)$$

---

## 🛠️ Development & Running

```bash
# Install dependencies
npm install

# Start local development server
npm run dev

# Run math and causal alignment unit tests
node scripts/test_math.mjs

# Build production bundle
npm run build
```
