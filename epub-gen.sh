cd content;
# pandoc $(node ../getFilesList.js) -o ../react-lernen.epub --metadata title=\"React lernen und verstehen\" --metadata author="Manuel Bieh" --epub-cover-image="../assets/react_book_cover-front-1000.png" --toc-depth=2;
# ts=$(date +"%Y%m%d-%H%M");
pandoc $(node ../getFilesList.js) -o "../dist/react-lernen-$(date +"%Y%m%d-%H%M").epub" --metadata title="React lernen und verstehen" --metadata author="Manuel Bieh" --epub-cover-image="../assets/react_book_cover-front-1000.png" --toc-depth=2;
cd -;
