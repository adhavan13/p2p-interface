"use clients";

import React, { useState, useEffect, useRef } from "react";
import {
  User,
  Smartphone,
  Server,
  Network,
  Building2,
  ArrowRight,
  CheckCircle,
  Clock,
} from "lucide-react";

const UPIArchitectureDiagram = () => {
  const [step, setStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [completedPaths, setCompletedPaths] = useState([]);
  const svgRef = useRef(null);
  const [svgSize, setSvgSize] = useState({ width: 1600, height: 700 });

  useEffect(() => {
    const updateSize = () => {
      if (svgRef.current) {
        setSvgSize({
          width: svgRef.current.clientWidth || 1600,
          height: svgRef.current.clientHeight || 700,
        });
      } else {
        const container = document.querySelector(".max-w-[1600px] .bg-white");
        if (container) {
          setSvgSize({
            width: container.clientWidth,
            height: container.clientHeight,
          });
        }
      }
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  const components = [
    {
      id: "sender",
      label: "Sender",
      icon: User,
      desc: "Initiates Payment",
      x: 8,
      y: 50,
      type: "user",
    },
    {
      id: "sender-app",
      label: "PSP App",
      icon: Smartphone,
      desc: "Payment Interface",
      x: 22,
      y: 50,
      type: "psp",
    },
    {
      id: "npci",
      label: "NPCI Switch",
      icon: Network,
      desc: "Payment Router",
      x: 50,
      y: 50,
      type: "npci",
    },
    {
      id: "sender-bank",
      label: "Sender Bank",
      icon: Building2,
      desc: "Debit Account",
      x: 50,
      y: 20,
      type: "bank",
    },
    {
      id: "receiver-bank",
      label: "Receiver Bank",
      icon: Building2,
      desc: "Credit Account",
      x: 50,
      y: 80,
      type: "bank",
    },
    {
      id: "receiver-app",
      label: "PSP App",
      icon: Smartphone,
      desc: "Notification",
      x: 78,
      y: 50,
      type: "psp",
    },
    {
      id: "receiver",
      label: "Receiver",
      icon: User,
      desc: "Receives Payment",
      x: 92,
      y: 50,
      type: "user",
    },
  ];

  const flowSteps = [
    {
      from: "sender",
      to: "sender-app",
      label: "1. Initiate Payment",
      color: "blue",
      status: "Request",
    },
    {
      from: "sender-app",
      to: "npci",
      label: "2. Send to NPCI",
      color: "blue",
      status: "Authorization",
    },
    {
      from: "npci",
      to: "sender-bank",
      label: "3. Route to Sender Bank",
      color: "blue",
      status: "Validation",
    },
    {
      from: "sender-bank",
      to: "npci",
      label: "4. Debit Confirmed",
      color: "orange",
      status: "Debit",
    },
    {
      from: "npci",
      to: "receiver-bank",
      label: "5. Route to Receiver Bank",
      color: "orange",
      status: "Transfer",
    },
    {
      from: "receiver-bank",
      to: "npci",
      label: "6. Credit Confirmed",
      color: "green",
      status: "Credit",
    },
    {
      from: "npci",
      to: "receiver-app",
      label: "7. Forward Status",
      color: "green",
      status: "Confirmation",
    },
    {
      from: "receiver-app",
      to: "receiver",
      label: "8. Notify Receiver",
      color: "green",
      status: "Complete",
    },
  ];

  const startAnimation = () => {
    setIsAnimating(true);
    setStep(0);
    setCompletedPaths([]);
  };

  useEffect(() => {
    if (!isAnimating) return;

    if (step < flowSteps.length) {
      const timer = setTimeout(() => {
        setCompletedPaths([...completedPaths, step]);
        setStep(step + 1);
      }, 1800);
      return () => clearTimeout(timer);
    } else {
      setTimeout(() => setIsAnimating(false), 1500);
    }
  }, [step, isAnimating]);

  const getComponentPosition = (compId) => {
    const comp = components.find((c) => c.id === compId);
    if (!comp) return { x: svgSize.width / 2, y: svgSize.height / 2 };
    const svgWidth = svgSize.width || 1600;
    const svgHeight = svgSize.height || 700;
    return {
      x: (comp.x / 100) * svgWidth,
      y: (comp.y / 100) * svgHeight,
    };
  };

  const isComponentActive = (compId) => {
    if (!isAnimating || step === 0) return false;
    const currentStep = flowSteps[step - 1];
    return (
      currentStep && (currentStep.from === compId || currentStep.to === compId)
    );
  };

  const getPathColor = (stepIndex) => {
    const s = flowSteps[stepIndex];
    if (s.color === "blue") return "#3b82f6";
    if (s.color === "orange") return "#f97316";
    if (s.color === "green") return "#10b981";
    return "#64748b";
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      {/* Header */}
      <div className="max-w-[1600px] mx-auto mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-1">
                UPI Payment Architecture
              </h1>
              <p className="text-slate-600">End-to-End Transaction Flow</p>
            </div>
            {isAnimating && step > 0 && step <= flowSteps.length && (
              <div className="flex items-center gap-3 px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg">
                <Clock className="text-blue-600" size={20} />
                <div className="text-sm">
                  <div className="font-semibold text-slate-900">
                    {flowSteps[step - 1].status}
                  </div>
                  <div className="text-slate-600">
                    Step {step} of {flowSteps.length}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Architecture Diagram */}
      <div className="max-w-[1600px] mx-auto">
        <div
          className="bg-white rounded-lg shadow-sm border border-slate-200 relative"
          style={{ height: "700px" }}
        >
          {/* SVG for connections and animations */}
          <svg
            ref={svgRef}
            viewBox={`0 0 ${svgSize.width} ${svgSize.height}`}
            preserveAspectRatio="xMinYMin meet"
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{ zIndex: 1 }}
          >
            <defs>
              <marker
                id="arrowhead-blue"
                markerUnits="userSpaceOnUse"
                markerWidth="10"
                markerHeight="10"
                refX="9"
                refY="3"
                orient="auto"
              >
                <polygon points="0 0, 10 3, 0 6" fill="#3b82f6" />
              </marker>
              <marker
                id="arrowhead-orange"
                markerUnits="userSpaceOnUse"
                markerWidth="10"
                markerHeight="10"
                refX="9"
                refY="3"
                orient="auto"
              >
                <polygon points="0 0, 10 3, 0 6" fill="#f97316" />
              </marker>
              <marker
                id="arrowhead-green"
                markerUnits="userSpaceOnUse"
                markerWidth="10"
                markerHeight="10"
                refX="9"
                refY="3"
                orient="auto"
              >
                <polygon points="0 0, 10 3, 0 6" fill="#10b981" />
              </marker>
            </defs>

            {/* Static connection paths */}
            {flowSteps.map((s, idx) => {
              const fromRaw = getComponentPosition(s.from);
              const toRaw = getComponentPosition(s.to);
              // offset endpoints so paths start/stop at box edges instead of centers
              const hOffset = 90; // approx half box width
              const vOffset = 60; // approx half box height
              let from = { ...fromRaw };
              let to = { ...toRaw };
              if (Math.abs(fromRaw.y - toRaw.y) < 2) {
                // horizontal
                if (fromRaw.x < toRaw.x) {
                  from.x = fromRaw.x + hOffset;
                  to.x = toRaw.x - hOffset;
                } else {
                  from.x = fromRaw.x - hOffset;
                  to.x = toRaw.x + hOffset;
                }
              } else if (Math.abs(fromRaw.x - toRaw.x) < 2) {
                // vertical
                if (fromRaw.y < toRaw.y) {
                  from.y = fromRaw.y + vOffset;
                  to.y = toRaw.y - vOffset;
                } else {
                  from.y = fromRaw.y - vOffset;
                  to.y = toRaw.y + vOffset;
                }
              }
              const isCompleted = completedPaths.includes(idx);
              const isCurrent = step - 1 === idx && isAnimating;

              // Calculate path based on direction
              let pathD;
              if (Math.abs(from.y - to.y) < 2) {
                // Horizontal path
                pathD = `M ${from.x} ${from.y} L ${to.x} ${to.y}`;
              } else {
                // Vertical path with curve
                const controlOffset = 20;
                if (from.y < to.y) {
                  // Going down
                  pathD = `M ${from.x} ${from.y} Q ${from.x} ${
                    from.y + controlOffset
                  } ${from.x} ${(from.y + to.y) / 2} T ${to.x} ${to.y}`;
                } else {
                  // Going up
                  pathD = `M ${from.x} ${from.y} Q ${from.x} ${
                    from.y - controlOffset
                  } ${from.x} ${(from.y + to.y) / 2} T ${to.x} ${to.y}`;
                }
              }

              return (
                <g key={idx}>
                  <path
                    d={pathD}
                    stroke={isCompleted ? getPathColor(idx) : "#e2e8f0"}
                    strokeWidth={isCompleted || isCurrent ? "3" : "2"}
                    strokeDasharray={isCompleted ? "0" : "5,5"}
                    fill="none"
                    markerEnd={
                      isCompleted || isCurrent
                        ? `url(#arrowhead-${s.color})`
                        : undefined
                    }
                    opacity={isCompleted ? "0.8" : "0.3"}
                  />
                </g>
              );
            })}

            {/* Animated data packet */}
            {isAnimating &&
              step > 0 &&
              step <= flowSteps.length &&
              (() => {
                const s = flowSteps[step - 1];
                const fromRaw = getComponentPosition(s.from);
                const toRaw = getComponentPosition(s.to);
                const hOffset = 90;
                const vOffset = 60;
                let from = { ...fromRaw };
                let to = { ...toRaw };
                if (Math.abs(fromRaw.y - toRaw.y) < 2) {
                  if (fromRaw.x < toRaw.x) {
                    from.x = fromRaw.x + hOffset;
                    to.x = toRaw.x - hOffset;
                  } else {
                    from.x = fromRaw.x - hOffset;
                    to.x = toRaw.x + hOffset;
                  }
                } else if (Math.abs(fromRaw.x - toRaw.x) < 2) {
                  if (fromRaw.y < toRaw.y) {
                    from.y = fromRaw.y + vOffset;
                    to.y = toRaw.y - vOffset;
                  } else {
                    from.y = fromRaw.y - vOffset;
                    to.y = toRaw.y + vOffset;
                  }
                }

                let pathD;
                if (Math.abs(from.y - to.y) < 2) {
                  pathD = `M ${from.x} ${from.y} L ${to.x} ${to.y}`;
                } else {
                  const controlOffset = 20;
                  if (from.y < to.y) {
                    pathD = `M ${from.x} ${from.y} Q ${from.x} ${
                      from.y + controlOffset
                    } ${from.x} ${(from.y + to.y) / 2} T ${to.x} ${to.y}`;
                  } else {
                    pathD = `M ${from.x} ${from.y} Q ${from.x} ${
                      from.y - controlOffset
                    } ${from.x} ${(from.y + to.y) / 2} T ${to.x} ${to.y}`;
                  }
                }

                return (
                  <g>
                    {/* Main packet */}
                    <circle r="7" fill={getPathColor(step - 1)} opacity="0.9">
                      <animateMotion dur="1.5s" path={pathD} fill="freeze" />
                    </circle>

                    {/* Glow effect */}
                    <circle
                      r="7"
                      fill="none"
                      stroke={getPathColor(step - 1)}
                      strokeWidth="2"
                    >
                      <animateMotion dur="1.5s" path={pathD} fill="freeze" />
                      <animate
                        attributeName="r"
                        from="7"
                        to="18"
                        dur="1.5s"
                        repeatCount="1"
                      />
                      <animate
                        attributeName="opacity"
                        from="0.8"
                        to="0"
                        dur="1.5s"
                        repeatCount="1"
                      />
                    </circle>
                  </g>
                );
              })()}
          </svg>

          {/* Component Boxes */}
          {components.map((comp) => {
            const Icon = comp.icon;
            const active = isComponentActive(comp.id);
            const isUser = comp.type === "user";

            return (
              <div
                key={comp.id}
                className={`absolute transition-all duration-300 ${
                  active ? "scale-105" : "scale-100"
                }`}
                style={{
                  left: `${comp.x}%`,
                  top: `${comp.y}%`,
                  transform: "translate(-50%, -50%)",
                  zIndex: 2,
                  width: isUser ? "140px" : "180px",
                }}
              >
                <div
                  className={`border-2 rounded-lg p-4 bg-white transition-all duration-300 ${
                    active
                      ? "border-blue-500 shadow-lg shadow-blue-200"
                      : "border-slate-300 shadow-md"
                  }`}
                >
                  <div className="flex flex-col items-center text-center gap-2">
                    <div
                      className={`p-3 rounded-lg transition-colors duration-300 ${
                        active ? "bg-blue-100" : "bg-slate-100"
                      }`}
                    >
                      <Icon
                        className={active ? "text-blue-600" : "text-slate-600"}
                        size={isUser ? 32 : 28}
                      />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm mb-0.5">
                        {comp.label}
                      </h3>
                      <p className="text-xs text-slate-600">{comp.desc}</p>
                    </div>
                  </div>

                  {/* Active indicator */}
                  {active && (
                    <div className="absolute top-2 right-2">
                      <div className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-pulse"></div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Current Step Label */}
          {isAnimating && step > 0 && step <= flowSteps.length && (
            <div
              className="absolute bottom-4 left-1/2 transform -translate-x-1/2"
              style={{ zIndex: 3 }}
            >
              <div className="bg-slate-900 text-white px-6 py-3 rounded-lg shadow-xl border border-slate-700">
                <div className="flex items-center gap-3">
                  <ArrowRight size={20} />
                  <span className="font-semibold">
                    {flowSteps[step - 1].label}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Completion Message */}
          {!isAnimating && step === flowSteps.length && (
            <div
              className="absolute inset-0 flex items-center justify-center bg-white/95 backdrop-blur-sm"
              style={{ zIndex: 4 }}
            >
              <div className="text-center">
                <CheckCircle
                  className="mx-auto mb-4 text-green-500"
                  size={64}
                />
                <h2 className="text-2xl font-bold text-slate-900 mb-2">
                  Transaction Complete
                </h2>
                <p className="text-slate-600">
                  Payment successfully transferred from Sender to Receiver
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Control Button */}
      <div className="max-w-[1600px] mx-auto mt-8 flex justify-center">
        <button
          onClick={startAnimation}
          disabled={isAnimating}
          className={`px-8 py-4 rounded-lg font-semibold shadow-lg transition-all duration-300 ${
            isAnimating
              ? "bg-slate-300 text-slate-500 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-xl"
          }`}
        >
          {isAnimating
            ? "Processing Transaction..."
            : step === flowSteps.length
            ? "Restart Flow"
            : "Start Transaction"}
        </button>
      </div>

      {/* Legend */}
      <div className="max-w-[1600px] mx-auto mt-6">
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
          <div className="flex items-center justify-center gap-8 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-0.5 bg-blue-500"></div>
              <span className="text-slate-700">Request Flow</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-0.5 bg-orange-500"></div>
              <span className="text-slate-700">Processing</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-0.5 bg-green-500"></div>
              <span className="text-slate-700">Response Flow</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UPIArchitectureDiagram;
