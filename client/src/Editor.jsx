
import React, { useState } from "react";
import PropTypes from "prop-types"; // Import PropTypes
import axios from "axios";
import {
  FaSpellCheck,
  FaSyncAlt,
  FaCheck,
  FaPencilAlt,
  FaRedo,
  FaSpinner,
} from "react-icons/fa";
import { SiGrammarly } from "react-icons/si";

const Editor = () => {
  const [text, setText] = useState("");
  const [selectedSentence, setSelectedSentence] = useState("");
  const [rephrasedSentences, setRephrasedSentences] = useState([]);
  const [correctedSentences, setCorrectedSentences] = useState([]);
  const [spellCheckedText, setSpellCheckedText] = useState("");
  const [grammarCheckedText, setGrammarCheckedText] = useState("");
  const [loadingSpellCheck, setLoadingSpellCheck] = useState(false);
  const [loadingGrammarCheck, setLoadingGrammarCheck] = useState(false);
  const [loadingRephrase, setLoadingRephrase] = useState(false);

  const handleTextChange = (e) => setText(e.target.value);

  const handleSentenceSelection = () => {
    const selection = window.getSelection().toString();
    if (selection) setSelectedSentence(selection);
  };

  const rephraseSentence = async () => {
    setLoadingRephrase(true);
    try {
      const response = await axios.post("http://localhost:5000/api/analyze", {
        sentence: selectedSentence,
      });
      setRephrasedSentences(response.data.rephrasedSentences);
    } catch (error) {
      console.error("Error rephrasing sentence:", error);
    } finally {
      setLoadingRephrase(false);
    }
  };

  const addCorrectedSentence = (sentence) => {
    setCorrectedSentences([...correctedSentences, sentence]);
  };

  const checkSpelling = async () => {
    setLoadingSpellCheck(true);
    try {
      const response = await axios.post(
        "http://localhost:5000/api/spellcheck",
        { text }
      );
      setSpellCheckedText(response.data.correctedText);
    } catch (error) {
      console.error("Error checking spelling:", error);
    } finally {
      setLoadingSpellCheck(false);
    }
  };

  const checkGrammar = async () => {
    setLoadingGrammarCheck(true);
    try {
      const response = await axios.post(
        "http://localhost:5000/api/grammarcheck",
        { text }
      );
      setGrammarCheckedText(response.data.correctedText);
    } catch (error) {
      console.error("Error checking grammar:", error);
    } finally {
      setLoadingGrammarCheck(false);
    }
  };

  // Added function to reset all fields
  const resetAll = () => {
    setText("");
    setSelectedSentence("");
    setRephrasedSentences([]);
    setCorrectedSentences([]);
    setSpellCheckedText("");
    setGrammarCheckedText("");
  };

  return (
    <div className="container mx-auto px-4 py-8 bg-gray-100 min-h-screen">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-bold mb-4 text-blue-600">
              AI Writing Assistant
            </h2>
            <p className="mb-4 text-gray-600">
              Enhance Your Writing: Grammar & Spell Check, Plus Rephrase
              Selected Text with a Click
            </p>
            <textarea
              value={text}
              onChange={handleTextChange}
              onMouseUp={handleSentenceSelection}
              placeholder="Type your text here..."
              rows={10}
              className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
            <div className="flex justify-end mt-4 space-x-4">
              <Button
                onClick={checkSpelling}
                icon={<FaSpellCheck />}
                loading={loadingSpellCheck}
              >
                Check Spelling
              </Button>
              <Button
                onClick={checkGrammar}
                icon={<SiGrammarly />}
                loading={loadingGrammarCheck}
              >
                Check Grammar
              </Button>
              {/* Added Reset button */}
              <Button onClick={resetAll} icon={<FaRedo />}>
                Reset
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <ResultSection
              title="Spell Checked Text"
              text={spellCheckedText}
              onAccept={() => addCorrectedSentence(spellCheckedText)}
              icon={<FaSpellCheck className="text-green-500" />}
            />
            <ResultSection
              title="Grammar Checked Text"
              text={grammarCheckedText}
              onAccept={() => addCorrectedSentence(grammarCheckedText)}
              icon={<SiGrammarly className="text-blue-500" />}
            />
          </div>

          {selectedSentence && (
            <div className="bg-white shadow-lg rounded-lg p-6 my-8">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <FaPencilAlt className="mr-2 text-purple-500" />
                Selected Sentence:
              </h3>
              <p className="mb-4">{selectedSentence}</p>
              <Button
                onClick={rephraseSentence}
                icon={<FaSyncAlt />}
                loading={loadingRephrase}
              >
                Rephrase
              </Button>
            </div>
          )}

          {rephrasedSentences.length > 0 && (
            <div className="bg-white shadow-lg rounded-lg p-6 my-8">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <FaSyncAlt className="mr-2 text-indigo-500" />
                Rephrased Sentences:
              </h3>
              {rephrasedSentences.map((sentence, index) => (
                <div
                  key={index}
                  className="mb-4 pb-4 border-b border-gray-200 last:border-b-0"
                >
                  <p className="mb-2">{sentence}</p>
                  <Button
                    onClick={() => addCorrectedSentence(sentence)}
                    icon={<FaCheck />}
                  >
                    Accept
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="md:col-span-1">
          <div className="bg-white shadow-lg rounded-lg p-6 sticky top-8">
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <FaCheck className="mr-2 text-green-500" />
              Corrected Sentences
            </h3>
            <p className="mb-4 text-gray-600">
              Your approved corrections will appear here.
            </p>
            {correctedSentences.length > 0 ? (
              correctedSentences.map((sentence, index) => (
                <div
                  key={index}
                  className="mb-2 pb-2 border-b border-gray-200 last:border-b-0"
                >
                  <p>{sentence}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-500 italic">
                No corrected sentences yet.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Button component with PropTypes
const Button = ({ onClick, children, icon, loading }) => (
  <button
    onClick={onClick}
    className="bg-blue-600 text-white px-4 py-2 rounded-full font-semibold hover:bg-blue-700 transition duration-300 flex items-center"
    disabled={loading}
  >
    {loading ? (
      <FaSpinner className="animate-spin mr-2" />
    ) : (
      icon && <span className="mr-2">{icon}</span>
    )}
    {children}
  </button>
);

Button.propTypes = {
  onClick: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
  icon: PropTypes.node,
  loading: PropTypes.bool,
};

// ResultSection component with PropTypes
const ResultSection = ({ title, text, onAccept, icon }) =>
  text && (
    <div className="bg-white shadow-lg rounded-lg p-6">
      <h3 className="text-xl font-semibold mb-4 flex items-center">
        {icon}
        <span className="ml-2">{title}</span>
      </h3>
      <p className="mb-4">{text}</p>
      <Button onClick={onAccept} icon={<FaCheck />}>
        Accept
      </Button>
    </div>
  );

ResultSection.propTypes = {
  title: PropTypes.string.isRequired,
  text: PropTypes.string,
  onAccept: PropTypes.func.isRequired,
  icon: PropTypes.node,
};

export default Editor;




