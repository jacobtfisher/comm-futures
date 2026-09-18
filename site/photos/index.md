---
layout: page
templateEngineOverride: njk
meta_title: Share your photos
meta_description: Send photos you take at Communication Science Futures to the organizing team.
title: Share your photos
sub_heading: Took a picture at Futures? Send it our way.
---

{# This is the page the printed QR codes point at (see images/photos-qr.svg and
   print/photos-sign.html). The QR encodes /photos/ rather than the Dropbox URL
   so the upload target can change without reprinting anything — swap the href
   below and redeploy.

   The Dropbox "file request" lets anyone upload without an account and never
   shows uploaders each other's files. It lives on a free Basic plan (2 GB), so
   the folder gets drained to OneDrive each evening of the conference. Email is
   the fallback for anyone who would rather not touch Dropbox. #}

<div class="photos-page">

    <div class="photos-actions">
        <a class="button photos-action" href="https://www.dropbox.com/request/3y8gd75ed3ij9s2tzrd6" rel="noopener">
            <span class="photos-action-label">Upload photos</span>
            <span class="photos-action-note">Opens a Dropbox upload page. No account needed.</span>
        </a>
        <a class="button button--outline photos-action" href="mailto:commscifutures@msu.edu?subject=Futures%20photos">
            <span class="photos-action-label">Or email them</span>
            <span class="photos-action-note">commscifutures@msu.edu</span>
        </a>
    </div>

    <div class="photos-fineprint flow">
        <p>Send as many as you like, in whatever quality your phone gives you. Only the organizing team sees what you upload.</p>
        <p>By sending photos you're letting us use them on this site and in Futures social posts and recaps. If you'd like a credit, put your name in the file name or in the email.</p>
    </div>

</div>
