const tabs = document.querySelectorAll('.tab');
const panels = document.querySelectorAll('.panel');

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('is-active'));
    panels.forEach(p => p.classList.remove('is-active'));

    tab.classList.add('is-active');

    const targetPanelId = tab.id.replace('btn-', 'panel-');
    const targetPanel = document.getElementById(targetPanelId);

    if (targetPanel) {
      targetPanel.classList.add('is-active');
    }
  });
});