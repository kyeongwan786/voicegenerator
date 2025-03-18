let audioResponse;


const $category = document.getElementById('category');
const $radio = $category.querySelectorAll(':scope > .label > .radio');
const $text = document.getElementById('text-input');
const $inputText = $text.querySelector(':scope > .label > .input[name="text"]');
const $dialogCover = document.getElementById('dialogCover');
const $dialog = document.getElementById('dialog');
const $button = $text.querySelector(':scope > .label > .button');
const $loading = document.getElementById('loading');
const $player = document.getElementById('player');
const $payDialog = document.getElementById('payDialog');
const $downButton = $player.querySelector(':scope > .button');
const $voiceCategory = {
    Lee: 'eC33ZSCaBMjC5wROeZG0',
    Park: 'ZQsT6WIFeMSHdhfJ4dVY'
};
const showPayDialog = () => {
    $payDialog.querySelector(':scope > .content > .button-container > .button.cancel').onclick = () => {
      hidePayDialog();
    };
    $payDialog.classList.add('visible');
};
$payDialog.querySelector(':scope > .content > .button-container > .button.ok').onclick = () => {
    const date = new Date();
    const imp = window.IMP;


    imp.init('imp73146134');
    imp.request_pay({
        pg: 'kakaopay.TC0ONETIME',
        pay_method: 'card',
        merchant_uid: `IMP-${date.getTime()}`,
        buyer_email: 'rkw2115@gmail.com',
        buyer_name: '류경완',
        amount: '10,000원',
        name: 'VoiceGenerator'
    }, (resp) => {
        if (resp.success === true) {
            showDialog('결제가 완료되었습니다. 파일을 다운로드 받습니다..', () => hidePayDialog());
            $downButton.onclick = () => {
              if (audioResponse) {
                  downloadAudio();
              } else {
                  showDialog('보이스를 먼저 생성해주세요.');
              }

            };
        } else {
            console.log(resp);
            alert('실패');
        }
    });
};





$downButton.onclick = () => {
    if (audioResponse) {
        showPayDialog();
    } else {
        showDialog('보이스를 먼저 생성해주세요.')
    }
};


const hidePayDialog = () => {
    $payDialog.classList.remove('visible');
};

const hideDialog = () => {
    $dialogCover.classList.remove('visible');
    $dialog.classList.remove('visible');
};
const showDialog = (content, callback) => {
    $dialog.querySelector(':scope > .content').innerText = content;
    $dialog.querySelector(':scope >.ok').onclick = () => {
        hideDialog();
        if (typeof callback === 'function') {
            callback();
        }
    };
    $dialogCover.classList.add('visible');
    $dialog.classList.add('visible');
};

const showLoading = () => {
    $loading.classList.add('visible');
    $dialogCover.classList.add('visible');
};
const hideLoading = () => {
    $loading.classList.remove('visible');
    $dialogCover.classList.remove('visible');
};


const $voiceSelect = () => {
  for (const radio of $radio) {
      if (radio.checked) {
          return $voiceCategory[radio.value];
      }
  }
};
const generator = () => {
    if (!$inputText.value) {
        showDialog('텍스트를 입력해주세요.');
        return;
    }
    const xhr = new XMLHttpRequest();
    console.log(xhr);
    xhr.onreadystatechange = () => {
        if (xhr.readyState !== XMLHttpRequest.DONE) {
            return;
        }
        hideLoading();
        if (xhr.status < 200 || xhr.status >= 400) {
            alert('연결에 실패하였습니다');
            return;
        }

        xhr.onload = () => {
            audioResponse = xhr.response;
            const blob = new Blob([xhr.response], {type: "audio/mp3"});
            const url = URL.createObjectURL(blob);
            console.log(url);
            const audio = new Audio(url);
            audio.play();

        };

    };
    xhr.open('POST', `https://api.elevenlabs.io/v1/text-to-speech/${$voiceSelect()}?output_format=mp3_44100_128`);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('xi-api-key', $voiceApiKey);
    xhr.responseType = 'blob';

    const sendData = {
        "text": $inputText.value,
        "model_id": "eleven_multilingual_v2"
    };
    xhr.send(JSON.stringify(sendData));
    showLoading();

};

$button.onclick = () => {
    generator();
}
$inputText.addEventListener('keydown', function(event) {
   if (event.key === 'Enter') {
       event.preventDefault();
       generator();
   }
});

const downloadAudio = () => {
  const blob = new Blob([audioResponse], {type:"audio/mp3"});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href=url;
  a.download = 'voice.mp3';
  a.click();
};