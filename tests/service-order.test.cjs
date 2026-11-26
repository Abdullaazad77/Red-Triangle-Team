const assert = require('node:assert/strict');
const test = require('node:test');
const { buildRequestMessage } = require('../js/service-order.js');
test('includes the service and every supplied requirement without HTML interpretation', () => {
 const message = buildRequestMessage('طلب تطبيق', [['الاسم', 'علي'], ['المنصة', 'Android و iOS'], ['الفكرة', '<متجر> & توصيل'], ['ملاحظات', '']]);
 assert.ok(message.includes('طلب تطبيق'));
 assert.ok(message.includes('الاسم: علي'));
 assert.ok(message.includes('المنصة: Android و iOS'));
 assert.ok(message.includes('الفكرة: <متجر> & توصيل'));
 assert.ok(!message.includes('ملاحظات:'));
 assert.equal(new URL('https://wa.me/9647750828279?text=' + encodeURIComponent(message)).searchParams.get('text'), message);
});
const vm = require('node:vm');
const fs = require('node:fs');
function mountForm() {
 const element = (value = '') => ({ value, hidden: false, attributes: {}, dataset: {}, style: {}, children: [], listeners: {}, classList: { toggle() {} }, setAttribute(k,v) { this.attributes[k] = v; }, removeAttribute(k) { delete this.attributes[k]; }, addEventListener(k,f) { this.listeners[k] = f; }, focus() { this.focused = true; }, setCustomValidity(v) { this.error = v; }, checkValidity() { return !this.error && (!this.required || !!this.value.trim()); }, reportValidity() {}, append(...nodes) { this.children.push(...nodes); }, replaceChildren() { this.children = []; } });
 const name = Object.assign(element(''), {required:true, dataset:{label:'الاسم'}});
 const requirements = Object.assign(element('فكرة التطبيق'), {required:true, dataset:{label:'الفكرة'}});
 const deadline = element('');
 const heading = element();
 const steps = [name, requirements, null].map(field => Object.assign(element(), { querySelector: () => heading, querySelectorAll: () => field ? [field] : [] }));
 steps[1].hidden = true; steps[2].hidden = true;
 const next = [element(),element()], back = [element(),element()];
 const form = Object.assign(element(), {dataset:{service:'طلب تطبيق'}, elements:{deadline}, querySelectorAll(selector) { return selector === '.form-step' ? steps : selector === '[data-label]' ? [name,requirements] : selector === '[data-next]' ? next : back; }});
 const nodes = {serviceOrderForm:form,requestStatus:element(),whatsappRequest:element(),progressBar:element(),requestSummary:element()};
 nodes.whatsappRequest.hidden = true;
 const document = {getElementById:id=>nodes[id],querySelectorAll:()=>[element(),element(),element()],createElement:()=>element(),addEventListener:(_,callback)=>callback()};
 vm.runInNewContext(fs.readFileSync(require.resolve('../js/service-order.js'),'utf8'), {document, Date});
 return {name, requirements, steps, next, back, form, nodes};
}
test('blocks empty required fields and preserves details when moving back', () => {
 const f = mountForm();
 f.next[0].listeners.click();
 assert.equal(f.steps[1].hidden, true);
 assert.equal(f.name.focused, true);
 f.name.value = 'علي';
 f.next[0].listeners.click();
 assert.equal(f.steps[0].hidden, true);
 assert.equal(f.steps[1].hidden, false);
 f.next[1].listeners.click();
 assert.equal(f.steps[2].hidden, false);
 assert.ok(f.nodes.requestSummary.children.some(node => node.textContent === 'فكرة التطبيق'));
 f.back[1].listeners.click();
 assert.equal(f.requirements.value, 'فكرة التطبيق');
});
test('prepares a WhatsApp draft without sending and invalidates it after edits', () => {
 const f = mountForm();
 f.name.value = 'علي';
 f.next[0].listeners.click(); f.next[1].listeners.click();
 f.form.listeners.submit({preventDefault(){}});
 assert.equal(f.nodes.whatsappRequest.hidden, false);
 const link = new URL(f.nodes.whatsappRequest.href);
 assert.equal(link.hostname, 'wa.me');
 assert.ok(link.searchParams.get('text').includes('فكرة التطبيق'));
 assert.ok(f.nodes.requestStatus.textContent.includes('لم يُرسل الطلب بعد'));
 f.form.listeners.input({target:f.requirements});
 assert.equal(f.nodes.whatsappRequest.hidden, true);
 assert.equal(f.nodes.requestStatus.textContent, '');
});
