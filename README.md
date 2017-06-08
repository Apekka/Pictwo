"# Pictwo" 

Projet de Pictionary multijoueur :
1 joueur dessine, les autres doivent deviner le mot représenté par le dessin.

Fonctionnalités implémentées :
- Un super logo
- Connexion, définition d'un pseudo
- Dès qu'il y a deux joueurs on commence le jeu
- On pioche des mots depuis un dictionnaire, un fichier txt parsé en tableau
- Le dessinateur ne peut pas taper dans le chat et le spectateur peut chater mais pas dessiner
- Dessin synchronisé entre les joueurs
- Chat qui détecte le mot quand la proposition est bonne, 1 points pour dessinateur et celui qui a trouvé, celui a trouvé va dessiner. Si personne ne trouve on prend une personne aléatoirement
- 10 rounds de 50 secondes avec classement final
- Si le dessinateur se déco on continue le round. Les spectateurs doivent deviner avec le dessin laissé, dans le temps impartit.

Difficulté :
- Envoyer les points du canvas par socket en captant les mouvements de la souris
- scoller en bas dans le chat quand on recoit un message

Choses à corriger/ajouter :
- Code fouillis et pas assez bien organisé avec répétitions (mais fonctionnel)
- Mieux organiser les fichiers (l'arborescence)
- Gérer les bugs côté client
- Gérer plusieurs rooms de jeu
- Scroller quand un nouveau message arrive
- Pouvoir relancer une partie à la fin sans relancer le serveur
- Gérer les pseudos uniques
- Avoir un classement ordonné en fonction du score
- Vérifier s'il reste plus d'un joueur de connecté 
- Améliorer le canvas pour pouvoir faire des points (le mousemove n'est pas appelé, donc rien n'est envoyé)

--- Par BAYART Timothée & PERY-KASZA Antoine ---
