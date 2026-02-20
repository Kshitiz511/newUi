import React, { useState, useEffect, useRef } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { motion, AnimatePresence } from "framer-motion";
import Editor from "@monaco-editor/react";

/* ---------- Constants & sample data ---------- */
const LANES = ["Backlog", "In Progress", "Testing", "Done", "Blocked"];

const BRD_SAMPLE = `Business Requirements Document
- Allow users to design products in web UI
- Secure checkout and payment
- Admin dashboard with analytics and refunds
`;

const TAP_SAMPLE = `Technical Architecture Plan
- Frontend: React SPA
- Backend: FastAPI microservices
- DB: PostgreSQL (demo: SQLite)
- Agents: Reasoning model (BRD) + coding model (code gen)
`;

/* Sample user stories to be "generated" by AI simulation */
const SAMPLE_STORIES = [
  {
    id: "S-101",
    title: "User authentication flow",
    desc: "As a user, I can sign up, login, and reset my password.",
    acceptance: [
      "Sign-up creates a user record",
      "Login returns session token",
      "Password reset via email works",
    ],
  },
  {
    id: "S-102",
    title: "Design product builder",
    desc: "Users can create and preview custom product designs.",
    acceptance: [
      "Design saved to DB",
      "Preview shows accurate rendering",
      "Design can be added to cart",
    ],
  },
  {
    id: "S-103",
    title: "Payment gateway integration",
    desc: "Integrate secure payment with retries.",
    acceptance: [
      "Payment success recorded",
      "Retry mechanism for transient failures",
      "Refund endpoint available for admins",
    ],
  },
];

/* ---------- Helpers ---------- */
function buildColumns(stories = []) {
  const cols = {};
  LANES.forEach((l) => (cols[l] = []));
  stories.forEach((s) => cols["Backlog"].push({ ...s, status: "Backlog", code: "" }));
  return cols;
}

/* ---------- App ---------- */
export default function App() {
  const [stage, setStage] = useState("idea"); // idea | review | kanban
  const [columns, setColumns] = useState(buildColumns());
  const [activity, setActivity] = useState([]);
  const [selected, setSelected] = useState(null);
  const [thinking, setThinking] = useState(false);
  const [streaming, setStreaming] = useState(false);
  const monacoRef = useRef(null);

  // initialize empty board
  useEffect(() => {
    setColumns(buildColumns());
  }, []);

  function pushActivity(text) {
    setActivity((a) => [{ id: Date.now(), text }, ...a].slice(0, 200));
  }

  /* ---------- Simulate "Approve" => AI thinking => generate stories ---------- */
  function handleApproveAndGenerate() {
    pushActivity("User clicked Approve — agent starting BRD/TAP reasoning (simulated)...");
    setThinking(true);

    // show step-by-step thinking labels (visual) using setTimeout
    setTimeout(() => pushActivity("Agent: Summarizing BRD..."), 600);
    setTimeout(() => pushActivity("Agent: Extracting epics and candidate stories..."), 1200);
    setTimeout(() => pushActivity("Agent: Formatting stories for backlog..."), 1600);

    setTimeout(() => {
      const created = SAMPLE_STORIES.map((s) => ({ ...s, status: "Backlog", code: "" }));
      setColumns(buildColumns(SAMPLE_STORIES));
      pushActivity(`Agent: Created ${created.length} user stories and placed them in Backlog.`);
      setThinking(false);
      setStage("kanban");
    }, 2500);
  }

  /* ---------- DnD ---------- */
  function onDragEnd(result) {
    const { source, destination, draggableId } = result;
    if (!destination) return;
    const src = source.droppableId;
    const dst = destination.droppableId;
    if (src === dst) return;

    const story = columns[src].find((s) => s.id === draggableId);
    if (!story) return;

    const newCols = { ...columns };
    newCols[src] = newCols[src].filter((s) => s.id !== draggableId);
    const updated = { ...story, status: dst };
    newCols[dst] = [updated, ...newCols[dst]];
    setColumns(newCols);
    setSelected(updated);
    pushActivity(`User moved ${story.id} → ${dst}`);

    // auto-trigger behaviors
    if (dst === "In Progress") simulateCodeGeneration(updated.id);
    if (dst === "Testing") simulateTestRun(updated.id);
  }

  /* ---------- Simulate code generation streaming into Monaco ---------- */
  function simulateCodeGeneration(storyId) {
    pushActivity(`Agent: Starting code generation for ${storyId}`);
    setStreaming(true);

    // Generate pseudo-code lines; stream them into story.code
    const snippetLines = [
      `def ${storyId.toLowerCase()}_handler(user, payload):`,
      `    # Generated code for ${storyId}`,
      `    if user is None:`,
      `        raise ValueError("invalid user")`,
      `    # process payload`,
      `    return {"status":"ok", "id":"${storyId}-tx"}`,
    ];

    // append lines gradually
    let i = 0;
    const interval = setInterval(() => {
      setColumns((cols) => {
        const newCols = { ...cols };
        for (const lane of LANES) {
          newCols[lane] = newCols[lane].map((s) => {
            if (s.id === storyId) {
              const code = (s.code || "") + snippetLines[i] + "\n";
              return { ...s, code };
            }
            return s;
          });
        }
        return newCols;
      });
      i++;
      if (i >= snippetLines.length) {
        clearInterval(interval);
        setStreaming(false);
        pushActivity(`Agent: Code generation completed for ${storyId}`);
      }
    }, 350);
  }

  /* ---------- Simulate test run (deterministic for demo) ---------- */
  function simulateTestRun(storyId) {
    pushActivity(`Agent: Running tests for ${storyId} (simulated)`);
    setTimeout(() => {
      // demo rule: S-101 passes, others fail to show Blocked path
      const pass = storyId === "S-101";
      if (pass) {
        moveStoryTo(storyId, "Done");
        pushActivity(`Agent: Tests passed for ${storyId} → moved to Done`);
      } else {
        moveStoryTo(storyId, "Blocked");
        pushActivity(`Agent: Tests failed for ${storyId} → moved to Blocked`);
      }
    }, 1200);
  }

  function moveStoryTo(id, dst) {
    setColumns((cols) => {
      const newCols = { ...cols };
      for (const l of LANES) {
        newCols[l] = newCols[l].filter((s) => s.id !== id);
      }
      // create updated story; try to preserve code/acceptance if exists
      const existing = Object.values(columns).flat().find((s) => s.id === id) || {};
      const updated = { ...existing, id, status: dst };
      newCols[dst] = [updated, ...newCols[dst]];
      return newCols;
    });
  }

  /* ---------- Editor mount (optional hook) ---------- */
  function handleEditorMount(editor, monaco) {
    monacoRef.current = editor;
  }

  return (
    <div className="app">
      {/* LEFT */}
      <div className="sidebar">
        <div className="brand">
          <div className="logo">AI</div>
          <div>
            <h1>AI SDLC Platform</h1>
            <div className="kv">Enterprise Demo</div>
          </div>
        </div>

        <div className="nav">
          <button className={stage === "kanban" ? "active" : ""} onClick={() => setStage("kanban")}>Board</button>
          <button className={stage === "idea" ? "active" : ""} onClick={() => setStage("idea")}>Idea</button>
          <button className={stage === "review" ? "active" : ""} onClick={() => setStage("review")}>BRD/TAP</button>
        </div>

        <div style={{flex:1}} />
        <div className="kv">v1.0 • Demo</div>
      </div>

      {/* MAIN */}
      <div className="main">
        <div className="header">
          <div>
            <div style={{fontSize:16,fontWeight:700}}>Autonomous Sprint Board</div>
            <div className="kv">{thinking ? "Agent: reasoning..." : "Idle"}</div>
          </div>

          <div className="actions" style={{display:"flex",alignItems:"center",gap:12}}>
            <div className="header small">{streaming ? "Streaming code..." : "Console idle"}</div>
            <button className="btn" onClick={() => { handleApproveAndGenerate(); }}>Approve BRD & Generate</button>
          </div>
        </div>

        <div className="board-wrap">
          {/* CENTER BOARD */}
          <div style={{flex:1}}>
            {stage === "idea" && (
              <div style={{padding:20}}>
                <h2>Enter product idea</h2>
                <textarea defaultValue={"AI powered enterprise e-commerce platform"} style={{width:"100%",height:120,background:"transparent",border:"1px solid var(--border)",borderRadius:8,padding:12,color:"inherit"}} />
                <div style={{marginTop:12}}>
                  <button className="btn" onClick={() => setStage("review")}>Generate BRD & TAP</button>
                </div>
              </div>
            )}

            {stage === "review" && (
              <div style={{padding:20,display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                <div style={{background:"var(--card)",padding:14,borderRadius:8,border:"1px solid var(--border)"}}>
                  <h3>Business Requirements Document</h3>
                  <pre style={{whiteSpace:"pre-wrap"}}>{BRD_SAMPLE}</pre>
                </div>
                <div style={{background:"var(--card)",padding:14,borderRadius:8,border:"1px solid var(--border)"}}>
                  <h3>Technical Architecture Plan</h3>
                  <pre style={{whiteSpace:"pre-wrap"}}>{TAP_SAMPLE}</pre>
                </div>

                <div style={{gridColumn:"1 / span 2",marginTop:8}}>
                  <button className="btn" onClick={() => handleApproveAndGenerate()}>
                    {thinking ? "Agent thinking…" : "Approve & Generate User Stories"}
                  </button>
                </div>
              </div>
            )}

            {stage === "kanban" && (
              <DragDropContext onDragEnd={onDragEnd}>
                <div style={{display:"flex",gap:12}}>
                  {LANES.map((lane) => (
                    <div className="column" key={lane}>
                      <h3>
                        <span>{lane}</span>
                        <span className="small-badge">{columns[lane]?.length || 0}</span>
                      </h3>

                      <Droppable droppableId={lane}>
                        {(provided) => (
                          <div ref={provided.innerRef} {...provided.droppableProps} style={{flex:1,overflowY:"auto",paddingTop:6}}>
                            <AnimatePresence>
                              {columns[lane]?.map((story, i) => (
                                <Draggable key={story.id} draggableId={story.id} index={i}>
                                  {(prov, snap) => (
                                    <motion.div
                                      className="card"
                                      ref={prov.innerRef}
                                      {...prov.draggableProps}
                                      {...prov.dragHandleProps}
                                      layout
                                      initial={{opacity:0, y:8}}
                                      animate={{opacity:1, y:0}}
                                      exit={{opacity:0, y:-8}}
                                      style={{marginBottom:10}}
                                      onClick={() => setSelected(story)}
                                    >
                                      <div className="title">{story.title}</div>
                                      <div className="meta">
                                        <div className="kv">{story.id}</div>
                                        <div className="kv">{story.status}</div>
                                      </div>

                                      <div className="actions">
                                        <button className="small-badge" onClick={(e) => { e.stopPropagation(); moveStoryTo(story.id, "In Progress"); }}>Start</button>
                                        <button className="small-badge" onClick={(e) => { e.stopPropagation(); moveStoryTo(story.id, "Testing"); }}>Test</button>
                                      </div>
                                    </motion.div>
                                  )}
                                </Draggable>
                              ))}
                              {provided.placeholder}
                            </AnimatePresence>
                          </div>
                        )}
                      </Droppable>
                    </div>
                  ))}
                </div>
              </DragDropContext>
            )}
          </div>

          {/* RIGHT SIDE: Code + Activity */}
          <div className="sidepanel">
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div style={{fontSize:13,fontWeight:700}}>Live Code & Details</div>
              <div className="kv">{activity.length} events</div>
            </div>

            <div style={{borderRadius:8,overflow:"hidden",border:"1px solid rgba(255,255,255,0.03)"}}>
              <Editor
                height="320px"
                defaultLanguage="python"
                theme="vs-dark"
                value={selected ? selected.code || "// Move a story to In Progress to simulate code generation" : "// Select a story to view/edit code"}
                onMount={handleEditorMount}
                options={{ readOnly: true, minimap: { enabled: false }, fontSize:12 }}
              />
            </div>

            <div style={{display:"flex",gap:8,alignItems:"center",justifyContent:"space-between"}}>
              <div className="kv">Activity</div>
              <div className="kv">{thinking ? "Agent: thinking..." : streaming ? "Streaming code" : "Idle"}</div>
            </div>

            <div className="activity">
              {activity.map((a) => (
                <div className="activity-item" key={a.id}><strong>{new Date(a.id).toLocaleTimeString()}</strong> — {a.text}</div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT-SIDE STORY DETAIL DRAWER */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ x: 400 }}
            animate={{ x: 0 }}
            exit={{ x: 400 }}
            style={{
              width: 420,
              borderLeft: "1px solid var(--border)",
              padding: 18,
              background: "linear-gradient(180deg,#07102a,#050615)",
            }}
          >
            <div className="detail-header">
              <h3>{selected.title}</h3>
              <div className="kv">{selected.id}</div>
            </div>

            <p style={{color:"var(--muted)"}}>{selected.desc}</p>

            <h4 style={{marginBottom:6}}>Acceptance Criteria</h4>
            <ul>
              {(selected.acceptance || []).map((a, idx) => <li key={idx} style={{color:"var(--muted)",fontSize:13}}>{a}</li>)}
            </ul>

            <h4 style={{marginTop:12}}>Agent Notes</h4>
            <div style={{background:"rgba(255,255,255,0.02)",padding:8,borderRadius:6,color:"var(--muted)"}}>
              Generated by thinking-model (simulated) · provenance: demo
            </div>

            <div style={{marginTop:12,display:"flex",gap:8}}>
              <button className="btn" onClick={() => moveStoryTo(selected.id, "In Progress")}>Start</button>
              <button className="btn" onClick={() => moveStoryTo(selected.id, "Testing")}>Test</button>
              <button style={{marginLeft:"auto"}} onClick={() => setSelected(null)} className="small-badge">Close</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
