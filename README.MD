# Сайт-портфолио на jekyll

Представляю вашему вниманию статический сайт, который собирается на лету из форматированных документов.

## Как оно работает?
  
* Весь материал на сайте оформлен с помощью Markdown. Это легкий язык разметки, который позволяет редактировать голый текст, размечать в нем ссылки, вставлять картинки и списки, а затем компилировать его в HTML. Это гораздое удобнее, чем редактировать обычный HTML, потому что не нужно заботиться о закрытии тегов, переносах строк и прочих тонкостях. 
* Форматированные материалы оборачиваются в т.н. лэйаут, другой HTML-файл, в котором присутствуют элементы навигации, дополнительная информация, а так же отсылки к необходимым статическим ресурсам, вроде таблицы стилей и скриптов, которые обеспечивают работу динамических функций сайта.
* Материалы, обернутые в лэйаут раскладываются по определенным папкам автоматически, откуда их можно уже запустить и просмотреть прямо с жесткого диска, либо с веб-сервера. Раскладкой и сборкой занимается Jekyll, система управления содержимым, которая генерирует статический сайт на выходе, то есть просто набор HTML файлов и ресурсов. Jekyll умеет слушать изменения в файлах и сразу пересобирать сайт. Таким образом, редактируя и сохраняя файл, отформатированный в Markdown, через несколько секунд можно обновить страницу в браузере и увидеть изменения.
* Jekyll работает локально, то есть на компьютере автора. Далее, полученный HTML-сайт необходимо загрузить на веб-сервер, чтобы люди могли увидеть изменения непосредственно в интернете. Обыкновенно, веб-сервер предоставляет хостинг-компания за деньги, отдельно оплачивается исходящий трафик, т.е. объем материалов переданный посететилеям сайта по сети. Но так, как Jekyll генерирует безопасный статический сайт, который не требует базы данных и возможности исполнять код, мы можем воспользоваться одним из многочисленных бесплатных решений. Данный сайт пользуется услугой Github Pages, которая ориентирована на веб-разработчиков и позволяет бесплатно размешать статические материалы на серверах компании Github. Также, к их серверам прикручены оба наших домена. 

## Подробнее о Jekyll
* Система имеет входные и выходные (output) файлы.
  * **Входные**  (папка `input`) - это исходники, то что редактируется и изменяется до того, как в работу включился Jekyll. Любые изменения в этих файлах отслеживаются, после чего Jekyll пересобирает выходные файлы. Исходные материалы могут быть в разных форматах, на нашем сайте это markdown, но можно иметь материалы в HTML или HAML. 
  * **Выходные** (папка `output`) - это то что непосредственно можно просмотреть в браузере. При каждом изменении полностью вся папка output затирается и все содержимое воссоздается вновь. Поэтому, эти файлы никогда не должны редактироваться вручную, потому что все изменения будут потеряны.
* В терминологии системы различаются три вида содержимого:
  * Записи - категорезированные материалы, которые подразумевают более или периодическое обновление. На данном сайте-портфолио, это - работы. Все они находятся в папке `_posts`. Любые файлы, брошенные в эту папку будут отформатированы, обернуты в лэйаут и скомпилированы в HTML страницу. Но из-за того, что сайт двуязычный, нужно следовать определенным соглашениям, чтобы все хорошо и правильно работало.

    Рассмотрим пример работы "В небесах"

        input/_posts/audio/mastering/in-the-skies/en.md     <- описание на английском языке
        input/_posts/audio/mastering/in-the-skies/ru.md     <- описание на русском языке
        input/_posts/audio/mastering/in-the-skies/photo.png <- доп. материал, например фото
          ^     ^      ^      ^           ^
          |     |      |      |           название работы
          |     |      |      категория (опционально)
          |     |      тип работы (если video, то при проигрывании показывается видео-плеер)
          |     записи
          входные материалы
http://www.youtube.com/watch?v=2IB7NDUSBOo

    Описания работ могут быть в любом формате. Но если придерживаться определенных соглашений, то можно получить хорошие и опрятные результаты. 

    [Синтаксис markdown](daringfireball.net/projects/markdown/syntax) может показать немного устрашающим на первый взгляд, но на самом деле он очень удобен и позволяет добиваться любых результатов

    Пример описания на английском языке:


        <!-- Заголовок со ссылкой на youtube-материал. Если работа лежит в папке video, 
             то при проигрывании будет показан видео-плеер. 

             На выходе: <h2><a href="http://www.youtube.com/watch?v=2IB7NDUSBOo>In the skies</a></h2>

             Обратите внимание, что URL youtube-материала должна быть в указанном формате. -->

        ## [In the skies](http://www.youtube.com/watch?v=2IB7NDUSBOo)

        <!-- Пример прикрепления картинки загруженной в папку `_posts/audio/mastering/in-the-skies/`. 
             Обратите внимание, что путь к картинке должен быть относительным, т.е. не имеющий `/` в начале.
             И английское и русское описание будет иметь одинаковый путь к этой картинке -->

        ![Picture description](audio/mastering/in-the-skies/photo.jpg)


        <!-- Список с определениями. В нашем случае, используется для описания ролей 
             участников в работе. Вместо этого списка могут идти просто параграфы с текстом,
             картинка, или все вместе -->

        Guitar
        : Andrey Zloyan

        <!-- Пример указания дополнительной информации об участнике, которая будет
             показываться во всплывающей подсказке. В данном случае, имя оборачивается в тег <em> 
             и кэтому тегу добавляется атрибут title. На выходе: 
             <em title="4th Grushensky festival winner">Anvar Ismagilov</em> -->

        Author & performer
        : *Anvar Ismagilov*{:title="4th Grushensky festival winner"}

        Recording & mixing
        : Alexandr Fedorov

    В зависимости от того, в каких папках лежит материал, определяется будет ли виден видео-плеер или нет, и в какой категории можно будет найти эту работу. На данный момент видео-материалы не имеют категорий, а аудио-материалы разбиты на несколько под-категорий. При добавлении новой под-категории, необходимо в файле _config.yml указать перевод названия категории на русский язык (внизу файла)

  * Страницы

    Страницы - некатегоризуемые материалы, которые меняются реже чем записи и не отображаются в списке работ. В нашем случае, это страница с резюме, услугами и прочим. В отличие от записей, в которых язык определяется именем файла, у страниц язык определяется папкой в корне:

        input/ru/hello.md -> alexandrfedorov.ru/hello/ или localhost/ru/hello/index.html
        input/ru/about/index.md -> alexandrfedorov.ru/about/ или localhost/ru/about/index.html
        input/ru/about/profession.md -> alexandrfedorov.ru/profession/ или localhost/ru/about/profession/index.html
        input/en/about/index.md -> alexandrfedorov.com/about/ или localhost/en/about/index.html

    Как можно видеть, все страницы лежат в папке `en` или `ru`. На выходе создается папка с названием файла, а сама страница будет записана в файл index.html. Это сделано для того, чтобы можно было загружать дополнительные статические файлы которые бы как бы "лежали" внутри страницы (например http://alexandrfedorov.ru/about/photo.jpg).

  * Статические файлы
    Это файлы которые не форматируются и не оборачиваются в лэйаут. Они просто переносятся из папки input в папку output без изменений. В нашем случае это могут быть картинки (например, из папки `input/photos`) и документы (вордовский файл с резюме). Складывать внутрь сайта аудио, а тем более видео - плохая идея, потому что мы пользуемся бесплатным хостингом, у которого можно исчерпать лимиты. Кроме того, это неизбежно замедлит скорость работы jekyll и загрузку файлов на сервер.

    Как было указано в предыдущем пункте, статические файлы могут объединятся в папки со страницами. Например страница

        input/ru/about/index.md -> alexandrfedorov.ru/about/
        input/en/about/index.md -> alexandrfedorov.com/about/
        input/about/photo.jpg   -> alexandrfedorov.ru/about/photo.jpg
                                -> alexandrfedorov.com/about/photo.jpg

    Как видно, английская и русская версии сайта будут иметь разные страницы `about`, но фотография будет доступна в обоих версиях. Поэтому, внутри страниц и записей можно использовать картинки с идентичным путём (`about/photo.jpg` в данном случае, без `/` в начале) 





* Сайт поддерживает два языка, но можно добавить больше. Это означает, что все материалы и лэйауты должны быть продублированы на английском и русском языке. Все русские материалы находятся в папке ru, а английские в папке en. Русская версия сайта использует файл `input/_layouts/ru.haml` для обертки материалов, а английская - `input/_layouts/en.haml`. 

## Другие факты

* Для оформления HTML в лэйаутах используется HAML, а для CSS - SASS с compass. оВсе это прикрепленно к Jekyll, поэтому можно редактировать эти файлы и видеть изменения сразу. При благоприятных обстоятельствах, вам не придется ничего редактировать, но и сильно бояться их тоже не стоит.


## Первоначальная установка
Для того чтобы начать работу, необходимо три вещи:

1) GIT - Система контроля версий. Бездонная и мощная штука, но мы будем использовать минимум её возможностей для того чтобы загружать сайт в интернет и бэкапить результаты труда. Идет в комплекте в Mac OS X.

2) Rubygems - набор инструментов для компиляции сайта. Скопируйте следующий кусок в терминал и дождитесь завершения установки

    gem install jekyll
    gem install jekyll_ext
    gem install sass
    gem install haml
    gem install compass
    gem install compass-recipes
    gem install sassy-buttons
    gem install jekyll-haml
    gem install kramdown

3) Склонировать с github текущую версию сайта. Скопируйте в терминал. 

    cd ~
    mkdir Sites
    cd Sites
    git clone git@github.com:alexandrfedorov/alexandrfedorov.github.com.git
    cd alexandrfedorov.github.com
    git checkout gh-pages

## Как происходит повседневная работа с сайтом?
1) После установки, у вас в папке вашего пользователя появилась папка Sites, а в ней alexandrfedorov.github.com. Это ваша рабочая копия сайта.
2) Тепреь нужно запустить Jekyll чтобы он начал следить за изменениями и запустил веб-сервер. Скопируйте в терминал (спросит пароль)

    cd ~/Sites/alexandrfedorov.github.com
    sudo ejekyll --auto --server 80

3) Теперь можно зайти на http://localhost/ru чтобы увидеть сайт
4) Теперь вы можете редактировать сайт (в папке `input`) - добавлять записи в _posts, редактировать и добавлять страницы, догружать фотки, редактировать лэйауты. Постарайтесь не добавлять неиспользуемых файлов и в целом не "мусорить".

  Изменения сразу будут видны в браузере. Если вдруг отчего-то перестало в браузере грузиться, то посмотрите в Терминал, где запущен ejekyll - он может рассказать, где в форматировании материала была ошибка. Если оно просто перестало работать и причин видимых нет, закройте терминал и начните заново.
4.5)
  Если вы не удовтеорены изменениями, вдруг все перестало работать или что-то еще в этом роде, то можно откатиться до предыдущего бэкапа. Вы потеряете все изменения

    cd ~/Sites/alexandrfedorov.github.com
    git reset --hard

5) Когда вы удовлетворены изменениями, загрузите их на сервер. Это опционально, но крайне желательно. Позволит откатиться в будущем при возникновении проблем до сохраненного состояния.

    cd ~/Sites/alexandrfedorov.github.com
    git commit -a -m "Updates"
    git push origin gh-pages -f

6) Если вас все устраивает и вы хотите загрузить изменения на сайт уже в интернете (т.е. alexandrfedorov.ru и com), сделайте следующее:

    cd ~/Sites/alexandrfedorov.github.com
    ./deploy.sh

  Это создаст две дополнительные папки в Sites, `alexandrfedorov.ru` и `alexandrfedorov.com` и загрузит их на сервера. Готово.


## Напутствия

Для того чтобы начать размещать свои материалы, вам придется очистить весь мусор в _posts. Достаточно все удалить оттуда. Затем создайте там папки video и audio и последуйте примеру оформления работы указанному выше. Названия папок и категорий должны быть на английском. Если на русской версии названия категорий будут на английском, то добавьте перевод в файл _config.yml и перезапустите jekyll.