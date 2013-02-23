mkdir ../alexandrfedorov.ru
cp -R output/* ../alexandrfedorov.ru
cp -R output/ru/* ../alexandrfedorov.ru

mkdir ../alexandrfedorov.com
cp -R output/* ../alexandrfedorov.com
cp -R output/en/* ../alexandrfedorov.com

cd ../alexandrfedorov.ru
echo alexandrfedorov.ru > CNAME
git init
git checkout -b gh-pages
git checkout gh-pages
git remote add origin git@github.com:alexandrfedorov/ru.git -f
git add .
git commit -m "Update russian version of the website"
git push origin gh-pages -f

cd ../alexandrfedorov.com
echo alexandrfedorov.com > CNAME
git init
git checkout -b gh-pages
git checkout gh-pages
git remote add origin git@github.com:alexandrfedorov/en.git -f
git add .
git commit -m "Update english version of the website"
git push origin gh-pages -f
