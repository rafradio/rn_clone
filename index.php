<?php
    session_start();
?>
<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8">
        <title>Роснефть</title>
        <style>
	#map {
		display: inline-block;
		border-radius: 3px;
		box-shadow: rgba(0, 0, 0, 0.15) 0px 1px 20px;
		padding: 0px;
		background-color: #ffffff;
		box-sizing: border-box;
		width: 760px;
		height: 510px;
		vertical-align: top;
		}
	#data001,  #data002{
		display: inline-block;
		width: 357px;
		min-height: 510px;
		max-height: 690px;
		background-color: #ffffff;
		overflow-y: auto;
		overflow-x: hidden;
		margin-left: 10px;
		border-radius: 3px;
		box-shadow: rgba(0, 0, 0, 0.15) 0px 1px 20px;
		vertical-align: top;
		padding: 0 10px;
		box-sizing: border-box;
		text-align:left;
 		color:#455d7a;
		}
	#data001 h4, #data002 h4{font:11px LatoWeb; font-weight:bold; margin:5px; padding-bottom: 0px; color:#92a0b2; text-align: center;}
	.tnum{font:28px Arial; color:#455d7a;}
	#data001 td, #data001 div{border:1px dashed #EEE; padding:7px 0px 7px;}
	#data001 a{font-weight: normal;}
	#data002 td {border:1px dashed #EEE; padding:7px 0px 7px 10px;}
	#id_wave {
	    width: 280px;
	    border-width: 1px;
	    border-radius: 3px;
	    box-sizing: border-box;
	    border-color: #92a0b2;
	    color: #92a0b2;
	    padding: 3px 0px;
	    border-style: solid;
	    outline: 0;
	    font-size: 11px;
	    font-weight: bold;
	    box-shadow: rgba(0, 0, 0, 0.15) 0px 1px 5px;
	}
	.shap{
		position:absolute; z-index:-1; border:#800; border-radius:50px; padding:19px 7px; text-align: center; box-shadow: 0 0 0px #555;
	}
	#navi{cursor:pointer; font-size: 12px; margin:5px 0}
	</style>
        <script src="http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.js"></script>
        <script src="ymap2.js" type="text/javascript"></script>
    </head>
    <body>
        <?php
            $input = fopen("config.txt", "r");
            while(!feof($input)) { 
                $dataDB[] = trim(fgets($input));
            }
            $servername = $dataDB[0];
            $username = $dataDB[1];
            $password = $dataDB[2];
            $dbname = $dataDB[3];
            $conn = new mysqli($servername, $username, $password, $dbname);
            $conn->set_charset('utf8');
            $_SESSION['waves'] = array();
            $q = "SELECT id, name, current, client, sorting FROM efes.wave" 
              . " WHERE project_id=16 && wave.hidden_on_web=0;";
            $result_qaz = $conn->query($q);
            while($row_in = $result_qaz->fetch_assoc()) {
                $_SESSION['waves'][] = $row_in;
            }
        ?>
        <div class="transparentBoxDiv" style="width:1160px">
                <div id="map" style="display: inline-block;"></div>
                <div id="data001" style="display: none">
                        
                    
                        <div style="padding:5px; border:0px; margin-top:5px;">
                                <select name="wave" id="id_wave" onChange="mapObj.chgWave()">
                                        <?php foreach ($_SESSION['waves'] as $arr): ?>		
                                                <option value="<?=$arr['id']?>"><?=$arr['name']?></option>			
                                        <?php endforeach; ?>	
                                </select>
                        </div>
                        <div style="padding:5px; border:0px; margin-top:5px;">
                        </div>

                        <div style="padding:5px; border:0px; display: none;" id='navi'></div>

                        <table id="ptbl" style="margin-bottom:2px; width:287px;" cellpadding="0" cellspacing="0"></table>

                        <div style="margin-bottom: 5px;"><h4>ТОЧЕК ПРОВЕРЕНО: <span id="cnttask1"></span></h4></div>

                </div>


                <div id="data002" style="display: none">

                </div>

        <div style="position:absolute; z-index:10; right:400px; top:400px; border-radius:50px; background:#00F; padding:19px 7px; text-align: center; box-shadow: 0 0 7px #555; display: none;" id="linkback"><a href="#" style="color:#FFF;" >Назад</a></div>

        </div>
        <script src="main.js" ></script>
    </body>
</html>
