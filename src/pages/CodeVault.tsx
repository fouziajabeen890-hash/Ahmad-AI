import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Code2, Copy, PlayCircle, CheckCircle2, FileText, Database, Globe, Cpu, ChevronRight, Terminal } from 'lucide-react';
import { cn } from '../lib/utils';

const CATEGORIES = [
  { id: 'algorithms', name: 'Algorithms', icon: Cpu },
  { id: 'data', name: 'Data Processing', icon: Database },
  { id: 'automation', name: 'Automation', icon: FileText },
  { id: 'web', name: 'Web & API', icon: Globe },
];

const SNIPPETS = [
  {
    id: 'algo-1',
    categoryId: 'algorithms',
    title: 'Binary Search',
    description: 'Efficiently find an item from a sorted list of items. O(log n) time complexity.',
    code: `def binary_search(arr, target):\n    low, high = 0, len(arr) - 1\n    while low <= high:\n        mid = (low + high) // 2\n        if arr[mid] == target:\n            return mid\n        elif arr[mid] < target:\n            low = mid + 1\n        else:\n            high = mid - 1\n    return -1\n\n# Test the function\nnumbers = [2, 5, 8, 12, 16, 23, 38, 56, 72, 91]\nprint(f"Index of 23 is: {binary_search(numbers, 23)}")`
  },
  {
    id: 'algo-2',
    categoryId: 'algorithms',
    title: 'Quick Sort',
    description: 'A highly efficient, divide-and-conquer sorting algorithm.',
    code: `def quick_sort(arr):\n    if len(arr) <= 1:\n        return arr\n    pivot = arr[len(arr) // 2]\n    left = [x for x in arr if x < pivot]\n    middle = [x for x in arr if x == pivot]\n    right = [x for x in arr if x > pivot]\n    return quick_sort(left) + middle + quick_sort(right)\n\nprint(f"Sorted: {quick_sort([3, 6, 8, 10, 1, 2, 1])}")`
  },
  {
    id: 'data-1',
    categoryId: 'data',
    title: 'JSON Read/Write',
    description: 'Read and write JSON data to standard output/files.',
    code: `import json\n\n# Data to write\ndata = {\n    "name": "PythonBot",\n    "version": 3.10,\n    "active": True,\n    "skills": ["Data", "AI", "Web"]\n}\n\n# Convert dict to JSON string\njson_str = json.dumps(data, indent=4)\nprint("JSON String:")\nprint(json_str)\n\n# Parse JSON string back to dict\nparsed_data = json.loads(json_str)\nprint(f"\\nParsed Version: {parsed_data['version']}")`
  },
  {
    id: 'data-2',
    categoryId: 'data',
    title: 'CSV Parsing (DictReader)',
    description: 'Safely parse CSV strings or files into Python dictionaries.',
    code: `import csv\nimport io\n\n# Simulated CSV file content\ncsv_content = """name,age,role\\nAlice,28,Engineer\\nBob,34,Data Scientist\\nCharlie,25,Designer"""\n\n# Use io.StringIO to simulate a file for this example\nf = io.StringIO(csv_content)\n\nreader = csv.DictReader(f)\nfor row in reader:\n    print(f"{row['name']} is a {row['role']}")`
  },
  {
    id: 'web-1',
    categoryId: 'web',
    title: 'Fetch API Data',
    description: 'Make a GET request to a REST API using the built-in urllib module.',
    code: `import urllib.request\nimport json\n\nurl = "https://jsonplaceholder.typicode.com/users/1"\n\ntry:\n    # Open URL and read response\n    with urllib.request.urlopen(url) as response:\n        if response.status == 200:\n            data = json.loads(response.read().decode('utf-8'))\n            print(f"Name: {data['name']}")\n            print(f"Email: {data['email']}")\n            print(f"City: {data['address']['city']}")\nexcept Exception as e:\n    print(f"Error fetching data: {e}")`
  },
  {
    id: 'auto-1',
    categoryId: 'automation',
    title: 'Generate Random Passwords',
    description: 'Create secure, random passwords of any length using secrets and string modules.',
    code: `import secrets\nimport string\n\ndef generate_password(length=12):\n    # Define the alphabet (letters, digits, punctuation)\n    alphabet = string.ascii_letters + string.digits + string.punctuation\n    \n    # Generate a random string\n    password = ''.join(secrets.choice(alphabet) for _ in range(length))\n    return password\n\nprint("Generated Passwords:")\nfor _ in range(3):\n    print(generate_password(16))`
  }
];

export default function CodeVault() {
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0].id);
  const [activeSnippet, setActiveSnippet] = useState(SNIPPETS[0]);
  const [copied, setCopied] = useState(false);
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);

  const filteredSnippets = SNIPPETS.filter(s => s.categoryId === activeCategory);

  // Reset active snippet when category changes
  const handleCategoryChange = (categoryId: string) => {
    setActiveCategory(categoryId);
    const first = SNIPPETS.find(s => s.categoryId === categoryId);
    if (first) {
      setActiveSnippet(first);
      setOutput('');
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(activeSnippet.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const runCode = async () => {
    setIsRunning(true);
    setOutput('Running code...');
    try {
      const runResponse = await fetch('https://emkc.org/api/v2/piston/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          language: 'python',
          version: '3.10.0',
          files: [{ content: activeSnippet.code }]
        })
      });
      const data = await runResponse.json();
      if (data.run && data.run.output) {
        setOutput(data.run.output);
      } else if (data.message) {
         setOutput('Error: ' + data.message);
      } else {
        setOutput('Error executing code.');
      }
    } catch (error) {
      setOutput('Failed to run code. Network error.');
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-mesh relative">
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-black/50 pointer-events-none" />
      
      <div className="flex-1 flex flex-col lg:flex-row h-full max-w-[1920px] mx-auto w-full relative z-10">
        
        {/* Left Sidebar - Categories & Snippets */}
        <div className="w-full lg:w-80 border-r border-white/5 bg-black/40 flex flex-col">
          <div className="p-6 border-b border-white/5 bg-white/5 backdrop-blur-md shrink-0">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Code2 className="w-5 h-5 text-cyan-400" />
              Code Vault
            </h2>
            <p className="text-sm text-slate-400 mt-2">Ready-to-use Python templates and scripts.</p>
          </div>
          
          <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col">
            <div className="p-4 flex gap-2 overflow-x-auto custom-scrollbar shrink-0 border-b border-white/5">
               {CATEGORIES.map(cat => (
                 <button 
                   key={cat.id} 
                   onClick={() => handleCategoryChange(cat.id)}
                   className={cn(
                     "px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors flex items-center gap-2",
                     activeCategory === cat.id ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30" : "bg-white/5 text-slate-400 hover:bg-white/10 hover:text-slate-200 border border-transparent"
                   )}
                 >
                   <cat.icon className="w-4 h-4" />
                   {cat.name}
                 </button>
               ))}
            </div>

            <div className="p-4 flex-1 overflow-y-auto custom-scrollbar space-y-2">
              {filteredSnippets.map((snippet) => (
                <button
                  key={snippet.id}
                  onClick={() => {
                    setActiveSnippet(snippet);
                    setOutput('');
                  }}
                  className={cn(
                    "w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between group",
                    activeSnippet.id === snippet.id 
                      ? "bg-cyan-500/10 border-cyan-500/30" 
                      : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20"
                  )}
                >
                  <span className={cn(
                    "text-sm font-semibold transition-colors",
                    activeSnippet.id === snippet.id ? "text-cyan-300" : "text-slate-300 group-hover:text-white"
                  )}>
                    {snippet.title}
                  </span>
                  <ChevronRight className={cn(
                    "w-4 h-4 transition-colors",
                    activeSnippet.id === snippet.id ? "text-cyan-400" : "text-slate-600"
                  )} />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side - Code Display & Output */}
        <div className="flex-1 flex flex-col min-h-0 relative">
          
          <div className="p-6 md:p-8 border-b border-white/5 bg-black/20 shrink-0">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">{activeSnippet.title}</h1>
                <p className="text-slate-300 max-w-3xl leading-relaxed">{activeSnippet.description}</p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <button
                  onClick={copyToClipboard}
                  className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-slate-200 rounded-lg transition-colors border border-white/10 font-medium"
                >
                  {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Copied!' : 'Copy Code'}
                </button>
                <button
                  onClick={runCode}
                  disabled={isRunning}
                  className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg transition-colors border border-cyan-400 font-medium disabled:opacity-50"
                >
                  {isRunning ? <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" /> : <PlayCircle className="w-4 h-4" />}
                  {isRunning ? 'Running...' : 'Run Snippet'}
                </button>
              </div>
            </div>
          </div>

          <div className="flex-1 flex flex-col lg:flex-row min-h-0 bg-black/60">
            {/* Code Editor */}
            <div className="flex-1 flex flex-col min-h-[400px] lg:min-h-0 border-r border-white/5 relative">
              <pre className="flex-1 w-full p-6 text-cyan-100 font-mono text-sm leading-relaxed overflow-auto custom-scrollbar">
                <code>{activeSnippet.code}</code>
              </pre>
            </div>

            {/* Output Panel */}
            <div className="w-full lg:w-[400px] flex flex-col bg-[#050505]/80 shrink-0 border-t lg:border-t-0 border-white/5">
              <div className="px-4 py-3 border-b border-white/5 bg-white/5 flex items-center gap-2">
                 <Terminal className="w-4 h-4 text-slate-400" />
                 <span className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Console Output</span>
              </div>
              <div className="flex-1 p-4 font-mono text-sm overflow-y-auto custom-scrollbar">
                <pre className="whitespace-pre-wrap text-slate-300">
                  {output || 'Output will appear here after running...'}
                </pre>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
