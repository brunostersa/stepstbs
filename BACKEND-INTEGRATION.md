# 🔗 Integração com Backend - The Best Speaker 2025

## 📋 Visão Geral

Este projeto foi estruturado para integração completa com o backend existente onde vocês já têm o dashboard dos clientes. A aplicação agora suporta dois modos:

- **Modo Desenvolvimento**: Mantém o seletor de cenários para testes
- **Modo Produção**: Carrega dados reais do backend automaticamente

## 🏗️ Arquitetura da Integração

### **Estrutura de Arquivos Adicionados:**
```
TestePages/
├── api-config.js          # Configuração e cliente da API
├── data-manager.js        # Gerenciamento de dados e estados
├── BACKEND-INTEGRATION.md # Esta documentação
└── ...arquivos existentes
```

### **Fluxo de Dados:**
```
Backend API → api-config.js → data-manager.js → script.js → UI
```

## 🔧 Configuração da API

### **Variáveis de Ambiente:**
```javascript
// Em api-config.js
const API_CONFIG = {
    BASE_URL: process.env.NODE_ENV === 'production' 
        ? 'https://api.tbs.com.br'           // Produção
        : 'http://localhost:3000/api',       // Desenvolvimento
    // ... outros endpoints
};
```

### **Endpoints Necessários no Backend:**

#### **1. Autenticação**
- `POST /auth/login` - Login do usuário
- `POST /auth/refresh` - Renovar token
- `POST /auth/logout` - Logout
- `GET /auth/verify` - Verificar token

#### **2. Dados do Usuário**
- `GET /user/profile` - Perfil do usuário
- `GET /user/status` - Status atual no TBS
- `GET /user/timeline` - Timeline de progresso

#### **3. Cenários e Resultados**
- `GET /scenarios/status` - Status do cenário atual
- `POST /scenarios/update` - Atualizar status
- `GET /scenarios/challenges` - Desafios da etapa atual

#### **4. Formulários**
- `POST /forms/tbs2026-optin` - Opt-in para TBS 2026
- `POST /forms/challenge-submission` - Submissão de desafios

## 📊 Estrutura de Dados

### **Resposta do Endpoint `/user/status`:**
```json
{
    "user_id": "12345",
    "stage": "waiting_270_100",
    "current_step": 1,
    "completed_steps": [0],
    "next_deadline": "2024-10-06T00:00:00Z",
    "challenges_available": false,
    "can_submit": false
}
```

### **Mapeamento de Status para Cenários:**
```javascript
const scenarioMapping = {
    'rejected_initial': 'rejected-initial',
    'waiting_270_100': 'waiting-270-100',
    'passed_270': 'passed-270',
    'passed_100': 'passed-100',
    'passed_20': 'passed-20',
    'rejected_etapa2': 'rejected-p1',  // Mapeia para o ID existente
    'rejected_etapa3': 'rejected-p2'   // Mapeia para o ID existente
};
```

### **Resposta do Endpoint `/user/timeline`:**
```json
{
    "timeline": [
        {
            "step": 0,
            "title": "Etapa 1: Seleção Inicial",
            "status": "completed",
            "completed_at": "2024-09-15T10:30:00Z"
        },
        {
            "step": 1,
            "title": "Etapa 2: Classificatória (Top 270)",
            "status": "waiting",
            "deadline": "2024-10-06T00:00:00Z"
        },
        {
            "step": 2,
            "title": "Etapa 3: Eliminatória",
            "status": "locked"
        },
        {
            "step": 3,
            "title": "Etapa 4: Reality TBS 2025 (Top 20)",
            "status": "locked"
        }
    ]
}
```

## 🚀 Como Implementar no Backend

### **1. Autenticação JWT**
```javascript
// Middleware de autenticação
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ error: 'Token não fornecido' });
    }
    
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: 'Token inválido' });
        req.user = user;
        next();
    });
};
```

### **2. Endpoint de Status do Usuário**
```javascript
// GET /user/status
app.get('/user/status', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const userStatus = await getUserStatusFromDatabase(userId);
        
        res.json({
            user_id: userId,
            stage: userStatus.stage,
            current_step: userStatus.current_step,
            completed_steps: userStatus.completed_steps,
            next_deadline: userStatus.next_deadline,
            challenges_available: userStatus.challenges_available,
            can_submit: userStatus.can_submit
        });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao obter status do usuário' });
    }
});
```

### **3. Endpoint de Opt-in TBS 2026**
```javascript
// POST /forms/tbs2026-optin
app.post('/forms/tbs2026-optin', authenticateToken, async (req, res) => {
    try {
        const { opt_in } = req.body;
        const userId = req.user.id;
        
        await saveTBS2026OptIn(userId, opt_in);
        
        res.json({
            success: true,
            message: 'Opt-in registrado com sucesso',
            opt_in: opt_in
        });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao registrar opt-in' });
    }
});
```

## 🔄 Fluxo de Funcionamento

### **Modo Produção:**
1. **Usuário acessa a página** → Verifica autenticação
2. **Carrega dados do usuário** → API `/user/status` e `/user/timeline`
3. **Mapeia status para cenário** → Mostra cenário correto automaticamente
4. **Esconde seletor de cenários** → Interface limpa para o usuário
5. **Processa formulários** → Envia dados para backend

### **Modo Desenvolvimento:**
1. **Usuário acessa localhost** → Mantém seletor de cenários
2. **Permite alternar cenários** → Para testes e demonstrações
3. **Formulários simulados** → Alerts em vez de API calls

## 🛡️ Segurança

### **Headers de Segurança:**
```javascript
// Headers recomendados
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'https://tbs.com.br');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('X-Content-Type-Options', 'nosniff');
    res.header('X-Frame-Options', 'DENY');
    res.header('X-XSS-Protection', '1; mode=block');
    next();
});
```

### **Validação de Dados:**
```javascript
// Validação de opt-in
const validateOptIn = (req, res, next) => {
    const { opt_in } = req.body;
    
    if (!opt_in || !['sim', 'nao'].includes(opt_in)) {
        return res.status(400).json({ 
            error: 'Valor de opt-in inválido' 
        });
    }
    
    next();
};
```

## 📱 Estados da Interface

### **Loading States:**
- **Carregamento inicial**: Spinner com "Carregando seus dados..."
- **Envio de formulário**: Spinner com "Enviando..."
- **Erro de conexão**: Modal de erro com opção de retry

### **Error Handling:**
- **Token expirado**: Redireciona para login
- **Erro de rede**: Modal de erro com retry
- **Dados inválidos**: Validação client-side

## 🧪 Testes

### **Testes de Integração:**
```javascript
// Exemplo de teste
describe('API Integration', () => {
    test('should load user status correctly', async () => {
        const mockStatus = {
            stage: 'waiting_270_100',
            current_step: 1
        };
        
        // Mock da API
        jest.spyOn(window.tbsApi, 'getUserStatus')
            .mockResolvedValue(mockStatus);
        
        await window.tbsData.loadUserData();
        
        expect(window.tbsData.getCurrentScenario())
            .toBe('waiting-270-100');
    });
});
```

## 🚀 Deploy

### **Variáveis de Ambiente:**
```bash
# Produção
NODE_ENV=production
API_BASE_URL=https://api.tbs.com.br
JWT_SECRET=seu_jwt_secret_aqui

# Desenvolvimento
NODE_ENV=development
API_BASE_URL=http://localhost:3000/api
```

### **Build para Produção:**
```bash
# Minificar CSS e JS
npm run build

# Deploy para CDN/CloudFront
aws s3 sync dist/ s3://tbs-frontend/
```

## 📞 Suporte

Para dúvidas sobre a integração:
- **Frontend**: Verificar `api-config.js` e `data-manager.js`
- **Backend**: Implementar endpoints conforme documentação
- **Debug**: Usar console.log e Network tab do DevTools

---

**Status**: ✅ Pronto para integração com backend existente
**Última atualização**: Dezembro 2024
