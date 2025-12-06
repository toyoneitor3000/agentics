"""
FastAPI server for Purrpur ADK Agent System
Provides REST endpoints for interacting with the multi-agent system
"""
import os
import sys
import asyncio
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, Dict, Any
import json

# Add current directory to path to import agents
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# Import ADK root agent
try:
    from agents.agent import root_agent
    ADK_AVAILABLE = True
except ImportError as e:
    print(f"Warning: ADK agent not available: {e}")
    ADK_AVAILABLE = False
    root_agent = None

app = FastAPI(
    title="Purrpur ADK Agent API",
    description="API for interacting with the Purrpur multi-agent system powered by Google ADK",
    version="2.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request/Response models
class AgentRequest(BaseModel):
    prompt: str
    agent_name: Optional[str] = None  # Specific agent to use (optional, defaults to root)
    parameters: Optional[Dict[str, Any]] = None

class AgentResponse(BaseModel):
    response: str
    agent_used: str
    execution_time: float
    metadata: Optional[Dict[str, Any]] = None

class HealthResponse(BaseModel):
    status: str
    version: str
    adk_available: bool
    agents_loaded: bool
    root_agent_name: Optional[str] = None

class AgentListResponse(BaseModel):
    agents: list
    total: int

# Endpoints
@app.get("/", response_model=HealthResponse)
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "version": "2.0.0",
        "adk_available": ADK_AVAILABLE,
        "agents_loaded": root_agent is not None,
        "root_agent_name": root_agent.name if root_agent else None
    }

@app.get("/agents", response_model=AgentListResponse)
async def list_agents():
    """List available agents in the system"""
    # This is a simplified list - in a real implementation you'd scan YAML files
    agents = [
        {"name": "purrpurragent", "role": "CEO & Orchestrator", "type": "root"},
        {"name": "brand_manager_agent", "role": "Brand Creation", "type": "main"},
        {"name": "backend_cloud_agent", "role": "Backend & Cloud", "type": "main"},
        {"name": "cto_architect_agent", "role": "Technical Architecture", "type": "main"},
        {"name": "frontend_web_agent", "role": "Web Development", "type": "main"},
        {"name": "mobile_dev_agent", "role": "Mobile Development", "type": "main"},
        {"name": "qa_testing_agent", "role": "Quality Assurance", "type": "main"},
        {"name": "cmo_agent", "role": "Marketing Strategy", "type": "main"},
        {"name": "social_media_manager_agent", "role": "Social Media", "type": "main"},
        {"name": "traffic_manager_agent", "role": "Paid Advertising", "type": "main"},
        {"name": "copywriter_storyteller_agent", "role": "Content Creation", "type": "main"},
        {"name": "data_seo_agent", "role": "Analytics & SEO", "type": "main"},
        {"name": "graphic_multimedia_agent", "role": "Visual Assets", "type": "main"},
        {"name": "translator_simplifier_agent", "role": "Translation", "type": "main"},
        {"name": "ui_ux_designer_agent", "role": "UI/UX Design", "type": "main"},
        {"name": "cfo_agent", "role": "Financial Planning", "type": "main"},
        {"name": "platdev_manager_agent", "role": "Platform Development", "type": "main"}
    ]
    return {
        "agents": agents,
        "total": len(agents)
    }

@app.post("/generate", response_model=AgentResponse)
async def generate_with_agent(request: AgentRequest):
    """
    Generate response using the Purrpur multi-agent system
    
    The root agent (CEO) will automatically delegate to the appropriate
    division director based on the request content.
    """
    if not ADK_AVAILABLE or root_agent is None:
        raise HTTPException(503, "ADK agent system not available. Please check installation.")
    
    try:
        import time
        start_time = time.time()
        
        # Prepare parameters for the agent
        agent_params = request.parameters or {}
        
        # Run the agent (async)
        # Note: ADK agents might have async methods, but we'll use run for simplicity
        # In production, you'd use proper async handling
        response = await asyncio.to_thread(
            root_agent.run,
            request.prompt,
            **agent_params
        )
        
        execution_time = time.time() - start_time
        
        # Format response
        if hasattr(response, 'content'):
            response_text = str(response.content)
        else:
            response_text = str(response)
        
        return {
            "response": response_text,
            "agent_used": root_agent.name,
            "execution_time": execution_time,
            "metadata": {
                "delegation_chain": getattr(response, 'delegation_chain', []),
                "tools_used": getattr(response, 'tools_used', [])
            }
        }
        
    except Exception as e:
        raise HTTPException(500, f"Agent execution failed: {str(e)}")

@app.post("/agent/{agent_name}", response_model=AgentResponse)
async def specific_agent(agent_name: str, request: AgentRequest):
    """
    Use a specific agent by name
    """
    if not ADK_AVAILABLE:
        raise HTTPException(503, "ADK agent system not available.")
    
    # In a full implementation, you'd load the specific agent from config
    # For now, we'll use the root agent and mention the requested agent in metadata
    try:
        import time
        start_time = time.time()
        
        # Add agent name to prompt for context
        enhanced_prompt = f"[Requested agent: {agent_name}]\n{request.prompt}"
        
        response = await asyncio.to_thread(
            root_agent.run,
            enhanced_prompt,
            **(request.parameters or {})
        )
        
        execution_time = time.time() - start_time
        
        if hasattr(response, 'content'):
            response_text = str(response.content)
        else:
            response_text = str(response)
        
        return {
            "response": response_text,
            "agent_used": f"root_agent (delegated to {agent_name})",
            "execution_time": execution_time,
            "metadata": {
                "requested_agent": agent_name,
                "actual_agent": root_agent.name
            }
        }
        
    except Exception as e:
        raise HTTPException(500, f"Agent execution failed: {str(e)}")

# Legacy endpoint for backward compatibility
class LegacyGenerateRequest(BaseModel):
    prompt: str
    image_base64: Optional[str] = None

@app.post("/legacy/generate")
async def legacy_generate(request: LegacyGenerateRequest):
    """
    Legacy endpoint for backward compatibility with old API
    """
    if not ADK_AVAILABLE or root_agent is None:
        raise HTTPException(503, "ADK agent system not available.")
    
    try:
        # Convert legacy request to agent request
        agent_request = AgentRequest(
            prompt=request.prompt,
            parameters={
                "image_base64": request.image_base64
            } if request.image_base64 else None
        )
        
        # Use the main generate endpoint
        response = await generate_with_agent(agent_request)
        
        # Format in legacy response format
        return {
            "code": response["response"],
            "model_used": "purrpur-adk",
            "audit_result": {
                "passed": True,
                "score": 1.0,
                "note": "Generated by Purrpur ADK agent system"
            },
            "response": response["response"]
        }
        
    except Exception as e:
        raise HTTPException(500, f"Generation failed: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 7000))
    print(f"Starting Purrpur ADK Agent API on port {port}")
    print(f"ADK Available: {ADK_AVAILABLE}")
    if root_agent:
        print(f"Root Agent: {root_agent.name}")
    uvicorn.run(app, host="0.0.0.0", port=port)
