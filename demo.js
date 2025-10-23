
// Simple helpers using localStorage for front-end demos
const store = (key, val) => localStorage.setItem(key, JSON.stringify(val));
const load  = (key, fallback=[]) => { try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; } };

// Lead functions
function addLead(e){
  e.preventDefault();
  const leads = load('df_leads');
  const lead = {
    name: document.getElementById('lead_name').value.trim(),
    email: document.getElementById('lead_email').value.trim(),
    source: document.getElementById('lead_source').value.trim(),
    tag: document.getElementById('lead_tag').value.trim(),
    ts: new Date().toISOString()
  };
  if(!lead.name || !lead.email) return alert('Name and email are required.');
  leads.push(lead); store('df_leads', leads);
  renderLeads(); e.target.reset();
}
function renderLeads(){
  const leads = load('df_leads');
  const tbody = document.getElementById('lead_rows'); if(!tbody) return;
  tbody.innerHTML = leads.map(l=>`<tr><td>${l.name}</td><td>${l.email}</td><td>${l.source}</td><td>${l.tag}</td><td>${new Date(l.ts).toLocaleString()}</td></tr>`).join('');
  document.getElementById('lead_count').textContent = leads.length;
}

// Proposal functions
function generateProposal(e){
  e.preventDefault();
  const client = document.getElementById('client').value;
  const scope  = document.getElementById('scope').value;
  const price  = document.getElementById('price').value;
  const terms  = document.getElementById('terms').value || "Net 7 terms. 50% deposit to start. Remaining due upon delivery.";
  const html = `
  <h2 style="margin:0">Proposal — ${client}</h2>
  <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
  <h3>Scope</h3><p>${scope.replace(/\n/g,'<br>')}</p>
  <h3>Investment</h3><p><strong>$${Number(price).toLocaleString()}</strong> one-time</p>
  <h3>Terms</h3><p>${terms}</p>
  <p style="margin-top:24px">Signed: ______________________</p>`;
  document.getElementById('proposal_preview').innerHTML = html;
}

// Follow-up AI (template-based for demo)
function generateFollowup(){
  const tone = document.getElementById('tone').value;
  const context = document.getElementById('context').value.trim();
  const base = {
    friendly: "Hey {name}, loved our chat! Based on {context}, I put together a quick next step. Would a 10-minute call tomorrow work?",
    firm: "Hi {name}, following up on {context}. Let's finalize by EOD. Here is the short summary and next step to sign off.",
    executive: "Hello {name}, per our discussion on {context}, this note summarizes outcomes and the single action to move forward."
  }[tone] || "Hi {name}, following up on {context}.";
  const name = document.getElementById('prospect').value || "there";
  const msg = base.replace("{name}", name).replace("{context}", context || "your project");
  document.getElementById('followup_result').value = msg;
}

// Commission tracker
function addDeal(e){
  e.preventDefault();
  const deals = load('df_deals');
  const value = parseFloat(document.getElementById('deal_value').value||0);
  const pct   = parseFloat(document.getElementById('commission_pct').value||0);
  const name  = document.getElementById('deal_name').value||"Deal";
  const commission = Math.round(value * pct)/100;
  deals.push({name,value,pct,commission,ts:new Date().toISOString()});
  store('df_deals', deals);
  renderDeals(); e.target.reset();
}
function renderDeals(){
  const deals = load('df_deals');
  const tbody = document.getElementById('deal_rows'); if(!tbody) return;
  let totalValue=0, totalComm=0;
  tbody.innerHTML = deals.map(d=>{
    totalValue+=d.value; totalComm+=d.commission;
    return `<tr><td>${d.name}</td><td>$${d.value.toLocaleString()}</td><td>${d.pct}%</td><td>$${d.commission.toLocaleString()}</td><td>${new Date(d.ts).toLocaleString()}</td></tr>`
  }).join('');
  document.getElementById('sum_value').textContent = "$"+totalValue.toLocaleString();
  document.getElementById('sum_comm').textContent  = "$"+totalComm.toLocaleString();
}
document.addEventListener('DOMContentLoaded', ()=>{
  renderLeads(); renderDeals();
});
