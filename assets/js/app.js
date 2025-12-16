
(function(){
  const data = window.QCM_QUESTIONS || [];
  function shuffle(arr){for(let i=arr.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[arr[i],arr[j]]=[arr[j],arr[i]]}return arr}
  const questions = shuffle([...data]);
  const root = document.getElementById('quiz');
  const form = document.createElement('form');
  form.id = 'quiz-form';

  questions.forEach((q, idx)=>{
    const card = document.createElement('div'); card.className = 'card q';
    const title = document.createElement('h3');
    title.innerHTML = (idx+1)+'. '+q.question + ` <span class="badge">${q.categorie}</span>`;
    card.appendChild(title);
    const opts = document.createElement('div'); opts.className='options';
    q.options.forEach((opt,optIdx)=>{
      const label = document.createElement('label'); label.className='option';
      const input = document.createElement('input'); input.type='radio'; input.name = 'q'+q.id; input.value=optIdx;
      label.appendChild(input);
      const span = document.createElement('span'); span.textContent = opt;
      label.appendChild(span);
      opts.appendChild(label);
    });
    card.appendChild(opts);
    form.appendChild(card);
  });

  const controls = document.createElement('div'); controls.className='controls';
  const btnReset = Object.assign(document.createElement('button'),{type:'button', className:'btn btn-secondary', textContent:'Réinitialiser'});
  const btnSubmit = Object.assign(document.createElement('button'),{type:'button', className:'btn btn-primary', textContent:'Corriger & Afficher la surprise 🎁'});
  controls.append(btnReset, btnSubmit);
  form.appendChild(controls);
  root.appendChild(form);

  btnReset.addEventListener('click', ()=>{ [...form.querySelectorAll('input[type=radio]')].forEach(i=>i.checked=false); document.getElementById('result')?.remove(); });

  btnSubmit.addEventListener('click', ()=>{
    let score=0; const details=[];
    questions.forEach(q=>{
      const chosen = form.querySelector(`input[name=q${q.id}]:checked`);
      const val = chosen? parseInt(chosen.value,10): null;
      const ok = val===q.answer_index; if(ok) score++;
      details.push({id:q.id, ok, expected:q.answer_index, chosen:val});
    });

    document.getElementById('result')?.remove();
    const result = document.createElement('div'); result.id='result'; result.className='card result';

    const rank = (s=>{ if(s<=10) return 'Déconnexion totale 😅'; if(s<=20) return 'La connexion est là, on progresse !'; if(s<=30) return 'Super complicité !'; return 'Duo Parent/Ado au top ✨'; })(score);
    const scoreEl = document.createElement('div'); scoreEl.className='score';
    scoreEl.textContent = `Score : ${score} / ${questions.length} — ${rank}`;
    result.appendChild(scoreEl);

    const surprise = document.createElement('div'); surprise.className='surprise';
    surprise.innerHTML = `🎉SURPRISE POUR TOUS : chacun reçoit un <b>Joker Playlist</b> — vous pouvez chacun choisir <b>1 chanson</b> à ajouter à la playlist de la soirée !
<br><br><b>cliquez pour écouter :</b>
<ul class="playlist">
  <b>Petit Papa Noël </b> : <a href="https://www.youtube.com/watch?v=sGlXYeiCz_4&list=RDsGlXYeiCz_4&start_radio=1" target="_blank">chanson de Noël pour petits avec paroles</a>
  <br>
  <li>https://www.youtube.com/watch?v=1T9b0cax6s4&list=RD1T9b0cax6s4&start_radio=1Suggestion 1</a></li>
  <li>https://www.youtube.com/watch?v=sGlXYeiCz_4&list=RDsGlXYeiCz_4&start_radio=1Suggestion 2</a></li>
  <li>https://www.youtube.com/watch?v=24pUKRQt7fk&list=RD24pUKRQt7fk&start_radio=1Suggestion 3</a></li>
  <li>https://www.youtube.com/watch?v=7Z6G9g5s3bA&list=RD7Z6G9g5s3bA&start_radio=1Suggestion 4</a></li>
  <li>https://www.youtube.com/watch?v=0-EF60neguk&list=PLAdgambY15YZ64z_AXa6NJMuDRRrr09biSuggestion 5</a></li>
  <li>https://www.youtube.com/watch?v=eWupm_cePX8&list=RDeWupm_cePX8&start_radio=1Suggestion 6</a></li>
</ul>
<br><br>Et en bonus, écoutez <b>La Reine des Neiges</b> : <a href="https://www.youtube.com/watch?v=TX7_yZLbqEs" target="_blank">Libérée, délivrée 🎵</a>`;
    result.appendChild(surprise);

    const hr = document.createElement('hr'); result.appendChild(hr);

    const answersTitle = document.createElement('h4'); answersTitle.textContent = 'Bonnes réponses :';
    result.appendChild(answersTitle);

    const toggle = Object.assign(document.createElement('button'),{ type:'button', className:'btn btn-outline', textContent:'Afficher le récapitulatif' });
    result.appendChild(toggle);

    const list = document.createElement('ol'); list.className='small'; list.style.display='none';
    questions.forEach((q, idx)=>{
      const li = document.createElement('li');
      li.innerHTML = `<b>Q${idx+1}</b> — ${q.options[q.answer_index]}`;
      list.appendChild(li);

      const qCard = [...form.querySelectorAll('.q')].find(c=>c.querySelector(`input[name=q${q.id}]`));
      if(qCard){
        const optLabels = qCard.querySelectorAll('.option');
        optLabels.forEach((label, optIdx)=>{
          const input = label.querySelector('input');
          label.classList.remove('is-correct','is-wrong');
          if(optIdx===q.answer_index){ label.classList.add('is-correct'); }
          else if(input && input.checked){ label.classList.add('is-wrong'); }
          if(input){ input.disabled = true; }
        });
      }
    });
    result.appendChild(list);

    toggle.addEventListener('click', ()=>{
      const show = list.style.display==='none';
      list.style.display = show ? 'block' : 'none';
      toggle.textContent = show ? 'Masquer le récapitulatif' : 'Afficher le récapitulatif';
    });

    const legend = document.createElement('div'); legend.className='small';
    legend.textContent = 'Les réponses correctes sont surlignées en vert. Vos choix incorrects apparaissent en rouge.';
    result.appendChild(legend);

    form.appendChild(result);
    window.scrollTo({top: result.offsetTop-20, behavior:'smooth'});
  });
})();
