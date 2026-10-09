/* Demo helpers: wires up [data-demo] buttons and the docs table of contents. */
document.addEventListener('DOMContentLoaded', function () {
  var F = window.FramePER;

  var actions = {
    'toast-success': function () { F.Notify.success('Salvo', 'Suas alterações foram salvas com sucesso.'); },
    'toast-error':   function () { F.Notify.error('Falha', 'Não foi possível concluir a operação.'); },
    'toast-info':    function () { F.Notify.info('Novidade', 'Uma nova versão está disponível.'); },
    'toast-warning': function () { F.Notify.show('Atenção', 'Sua assinatura expira em 3 dias.', 'warning'); },
    'page-loader':   function () { F.Loader.showPageLoad(); setTimeout(function () { F.Loader.hidePageLoad(); }, 1800); },
    'btn-loading':   function (el) { F.Loader.buttonLoading(el, true); setTimeout(function () { F.Loader.buttonLoading(el, false); }, 1800); },
    'http-ok': function (el) {
      F.Loader.buttonLoading(el, true);
      F.Http.get('https://jsonplaceholder.typicode.com/todos/1').then(function (res) {
        F.Loader.buttonLoading(el, false);
        if (res.ok) F.Notify.success('GET 200', 'Recebido: "' + F.Security.escapeHTML(res.data.title) + '"');
      });
    },
    'http-404': function (el) {
      F.Loader.buttonLoading(el, true);
      F.Http.get('https://jsonplaceholder.typicode.com/posts/99999').then(function () {
        F.Loader.buttonLoading(el, false);
      });
    }
  };

  document.querySelectorAll('[data-demo]').forEach(function (el) {
    el.addEventListener('click', function () {
      var fn = actions[el.getAttribute('data-demo')];
      if (fn) fn(el);
    });
  });

  // XSS escape playground
  var input = document.getElementById('escape-input');
  var output = document.getElementById('escape-output');
  if (input && output) {
    var render = function () { output.textContent = F.Security.escapeHTML(input.value); };
    input.addEventListener('input', render);
    render();
  }

  // Table of contents scroll-spy
  var links = Array.prototype.slice.call(document.querySelectorAll('.docs-nav a'));
  if (links.length && 'IntersectionObserver' in window) {
    var map = {};
    links.forEach(function (a) { map[a.getAttribute('href').slice(1)] = a; });

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          links.forEach(function (a) { a.classList.remove('active'); });
          var link = map[entry.target.id];
          if (link) link.classList.add('active');
        }
      });
    }, { rootMargin: '-20% 0px -70% 0px' });

    document.querySelectorAll('.docs-section').forEach(function (s) { observer.observe(s); });
  }
});
