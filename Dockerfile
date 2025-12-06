FROM node:18-slim
WORKDIR /app

# deps node
COPY app/package.json ./
RUN npm install

# deps python
RUN apt-get update && apt-get install -y python3 python3-pip python3-venv
COPY requirements.txt /tmp/
RUN pip install --break-system-packages -r /tmp/requirements.txt

# código
COPY . .

# Set PYTHONPATH so agents module can be found
ENV PYTHONPATH=/app

EXPOSE 7000
WORKDIR /app/agents
CMD ["python3", "-m", "uvicorn", "api:app", "--host", "0.0.0.0", "--port", "7000"]
